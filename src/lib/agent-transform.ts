// Transform snake_case DB row to camelCase Agent type
export function transformAgent(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    status: row.status,
    creator: row.creator_wallet || '',
    avatar: row.avatar_url || '',
    website: row.website,
    twitter: row.twitter,
    discord: row.discord,
    tokenSymbol: row.token_symbol,
    tokenAddress: row.token_address,
    chain: row.chain,
    tags: row.tags || [],
    featured: row.featured,
    createdAt: row.created_at,
    metrics: {
      users: row.metrics_users || 0,
      transactions: row.metrics_transactions || 0,
      volume: row.metrics_volume || 0,
      uptime: row.metrics_uptime || 99.9,
      rating: row.metrics_rating || 0,
      reviews: row.metrics_reviews || 0,
    },
  };
}
