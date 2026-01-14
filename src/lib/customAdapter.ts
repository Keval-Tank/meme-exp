import { createAdapterFactory } from 'better-auth/adapters'
import { prisma } from './prisma'
import { getRedisClient } from './redis'

export const custom_prisma_adapter = (config: any = {}) =>
    createAdapterFactory({
        config: {
            adapterId: 'custom-prisma-adapter',
            adapterName: 'Custom Prisma Adapter',
            usePlural: false,
            debugLogs: true,
            supportsJSON: false,
            supportsDates: true,
            supportsBooleans: true,
            supportsNumericIds: true,
            ...config,
        },

        adapter: ({ }) => {
            // helper to normalize model key
            const modelKey = (name: string) => (name ? name.toLowerCase() : name)

            return ({
                // create a record for supported models
                create: async ({ data, model, select }: any) => {
                    const m = modelKey(model)

                    if (m === 'user') {
                        const created = await prisma.user.create({
                            data: {
                                id: data.id,
                                name: data.name ?? '',
                                email: data.email,
                                password: data.password ?? '',
                                emailVerified: data.emailVerified ?? false,
                                image: data.image ?? null,
                                provider: data.provider ?? null,
                                providerId: data.providerId ?? null,
                            },
                            select: select ?? undefined,
                        })

                        return created
                    }

                    if (m === 'session') {
                        const created = await prisma.session.create({
                            data: {
                                id: data.id,
                                token: data.token,
                                expiresAt: data.expiresAt,
                                ipAddress: data.ipAddress ?? null,
                                userAgent: data.userAgent ?? null,
                                userId: data.userId,
                            },
                            select: select ?? undefined,
                        })

                        return created
                    }

                    if (m === 'account') {
                        // We don't have a dedicated account table in schema.prisma.
                        // Map provider info to the user record instead.
                        await prisma.user.update({
                            where: { id: data.userId },
                            data: {
                                provider: data.provider,
                                providerId: data.providerAccountId,
                                updatedAt: new Date(),
                            },
                        })

                        // Return a synthetic account-like object
                        return {
                            id: `${data.provider}-${data.providerAccountId}`,
                            userId: data.userId,
                            provider: data.provider,
                            providerAccountId: data.providerAccountId,
                            access_token: data.access_token,
                            refresh_token: data.refresh_token,
                            expires_at: data.expires_at,
                            token_type: data.token_type,
                            scope: data.scope,
                            id_token: data.id_token,
                        }
                    }

                    if (m === 'verification') {
                        // Use Redis for temporary verification values
                        const redis = await getRedisClient()
                        const key = `betterauth:verification:${data.identifier}:${data.type ?? 'email'}`
                        const payload = JSON.stringify({ value: data.value, expiresAt: data.expiresAt })
                        // set with TTL if expiresAt available
                        if (data.expiresAt && new Date(data.expiresAt) > new Date()) {
                            return { id: `${data.identifier}-${Date.now()}`, ...data }
                        }
                        if (data.expiresAt) {
                            const ttl = Math.max(1, Math.ceil((new Date(data.expiresAt).getTime() - Date.now()) / 1000))
                            await (redis as any).setex(key, ttl, payload)
                        } else {
                            await (redis as any).set(key, payload)
                        }
                        return { id: `${data.identifier}-${Date.now()}`, ...data }
                        // return null
                    }

                    throw new Error(`create: unsupported model ${model}`)
                },

                // find unique
                findUnique: async ({ where, model, select }: any) => {
                    const m = modelKey(model)

                    if (m === 'user') {
                        if (where?.id) {
                            return prisma.user.findUnique({ where: { id: where.id }, select: select ?? undefined })
                        }
                        if (where?.email) {
                            return prisma.user.findUnique({ where: { email: where.email }, select: select ?? undefined })
                        }
                    }

                    if (m === 'session') {
                        if (where?.token) {
                            return prisma.session.findUnique({ where: { token: where.token }, select: select ?? undefined })
                        }
                        if (where?.id) {
                            return prisma.session.findUnique({ where: { id: where.id }, select: select ?? undefined })
                        }
                    }

                    if (m === 'account') {
                        // find by provider & providerAccountId
                        if (where?.provider && where?.providerAccountId) {
                            const user = await prisma.user.findFirst({ where: { provider: where.provider, providerId: where.providerAccountId } })
                            if (!user) return null

                            return {
                                id: `${where.provider}-${where.providerAccountId}`,
                                userId: user.id,
                                provider: where.provider,
                                providerAccountId: where.providerAccountId,
                                user,
                            }
                        }
                    }

                    if (m === 'verification') {
                        const redis = await getRedisClient()
                        if (!redis) return null
                        const key = `betterauth:verification:${where.identifier}:${where.type ?? 'email'}`
                        const raw = await (redis as any).get(key)
                        if (!raw) return null
                        try {
                            const parsed = JSON.parse(raw)
                            return { identifier: where.identifier, value: parsed.value, expiresAt: parsed.expiresAt }
                        } catch (e) {
                            return null
                        }
                        // return null
                    }

                    return null
                },

                // find one (alias, required by adapter type)
                findOne: async ({ where, model, select }: any) => {
                    const redis = await getRedisClient()
                    if(model === 'verification'){
                         const keys = await redis.keys('verification:*')
                                for (const key of keys) {
                                    const data = await redis.get(key)
                                    if (data) {
                                        const parsed = JSON.parse(data)
                                        if (parsed.id === where.id) {
                                            console.log(`Verification found in Redis by ID: ${key}`)
                                            return parsed
                                        }
                                    }
                                }
                    }
                    return (await (this as any).findUnique?.({ where, model, select })) ?? null
                },

                // find first (used sometimes by libs)
                findFirst: async ({ where, model, select }: any) => {
                    const m = modelKey(model)

                    if (m === 'user') {
                        return prisma.user.findFirst({ where: where ?? undefined, select: select ?? undefined })
                    }

                    if (m === 'session') {
                        return prisma.session.findFirst({ where: where ?? undefined, select: select ?? undefined })
                    }

                    return null
                },

                // generic find many
                findMany: async ({ where, orderBy, skip, take, model, select }: any) => {
                    const m = modelKey(model)
                    if (m === 'user') return prisma.user.findMany({ where, orderBy, skip, take, select: select ?? undefined })
                    if (m === 'session') return prisma.session.findMany({ where, orderBy, skip, take, select: select ?? undefined })
                    return []
                },

                // count (required by adapter type)
                count: async ({ where, model }: any) => {
                    const m = modelKey(model)
                    if (m === 'user') return prisma.user.count({ where })
                    if (m === 'session') return prisma.session.count({ where })
                    return 0
                },

                update: async ({ where, data, model, select }: any) => {
                    const m = modelKey(model)

                    if (m === 'user') {
                        return prisma.user.update({ where, data, select: select ?? undefined })
                    }

                    if (m === 'session') {
                        return prisma.session.update({ where, data, select: select ?? undefined })
                    }

                    if (m === 'account') {
                        // update provider info on user
                        if (where?.id) {
                            const [provider, providerId] = String(where.id).split('-')
                            if (!provider || !providerId) return { id: where.id, ...data }
                            await prisma.user.updateMany({ where: { provider: provider, providerId: providerId }, data: { updatedAt: new Date() } })
                            return { id: where.id, ...data }
                        }
                    }

                    if (m === 'verification') {
                        // store/ove 1000))
                        //     await (redis as any).setex(key, ttl, payload)
                        // } else {
                        //     await (redis as any).set(key, payload)
                        // }
                        // return { id: `${where.identifier}-${Date.now()}`, ...data }rwrite verification in redis
                        // const redis = await getRedisClient()
                        // if (!redis) throw new Error('Redis client unavailable')
                        // const key = `betterauth:verification:${where.identifier}:${data.type ?? 'email'}`
                        // const payload = JSON.stringify({ value: data.value, expiresAt: data.expiresAt })
                        // if (data.expiresAt) {
                        //     const ttl = Math.max(1, Math.ceil((new Date(data.expiresAt).getTime() - Date.now()) /
                        // return null
                    }

                    throw new Error(`update: unsupported model ${model}`)
                },

                updateMany: async ({ where, data, model }: any) => {
                    const m = modelKey(model)

                    if (m === 'user') {
                        const r = await prisma.user.updateMany({ where, data })
                        return r.count
                    }
                    if (m === 'session') {
                        const r = await prisma.session.updateMany({ where, data })
                        return r.count
                    }

                    return 0
                },

                delete: async ({ where, model }: any) => {
                    const m = modelKey(model)

                    if (m === 'user') return prisma.user.delete({ where })
                    if (m === 'session') return prisma.session.delete({ where })

                    if (m === 'account') {
                        // reset provider fields on user
                        if (where?.id) {
                            const [provider, providerId] = String(where.id).split('-')
                            if (provider && providerId) {
                                await prisma.user.updateMany({ where: { provider: provider, providerId: providerId }, data: { provider: null, providerId: null } })
                            }
                        }
                        return
                    }

                    if (m === 'verification') {
                        const redis = await getRedisClient()
                        if (!redis) throw new Error('Redis client unavailable')
                        const key = `betterauth:verification:${where.identifier}:${where.type ?? 'email'}`
                        await (redis as any).del(key)
                        return
                        // return null
                    }

                    throw new Error(`delete: unsupported model ${model}`)
                },

                deleteMany: async ({ where, model }: any) => {
                    const m = modelKey(model)

                    if (m === 'session') {
                        const r = await prisma.session.deleteMany({ where })
                        return r.count
                    }
                    if (m === 'user') {
                        const r = await prisma.user.deleteMany({ where })
                        return r.count
                    }

                    return 0
                },
            } as any)
        },
    })