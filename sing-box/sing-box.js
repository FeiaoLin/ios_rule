const { type, name } = $arguments
const compatibleOutbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}
const placeholderAll = '{all}'

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.forEach(outbound => {
  if (!Array.isArray(outbound.outbounds)) return

  applyNamedGroupCompatibility(outbound, proxies)

  if (outbound.outbounds.includes(placeholderAll)) {
    const expanded = expandPlaceholderOutbounds(outbound, proxies)
    outbound.outbounds = mergeOutbounds(
      outbound.outbounds.filter(tag => tag !== placeholderAll),
      expanded
    )
  }

  if (Array.isArray(outbound.filter)) {
    delete outbound.filter
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatibleOutbound)
      compatible = true
    }
    outbound.outbounds.push(compatibleOutbound.tag)
  }
})

$content = JSON.stringify(config, null, 2)

function applyNamedGroupCompatibility(outbound, proxies) {
  if (['all', 'all-auto'].includes(outbound.tag)) {
    outbound.outbounds.push(...getTags(proxies))
  }
  if (['hk', 'hk-auto'].includes(outbound.tag)) {
    outbound.outbounds.push(...getTags(proxies, /香港|hk|hongkong|hong kong/i))
  }
  if (['tw', 'tw-auto'].includes(outbound.tag)) {
    outbound.outbounds.push(...getTags(proxies, /台湾|tw|taiwan/i))
  }
  if (['jp', 'jp-auto'].includes(outbound.tag)) {
    outbound.outbounds.push(...getTags(proxies, /日本|jp|japan/i))
  }
  if (['sg', 'sg-auto'].includes(outbound.tag)) {
    outbound.outbounds.push(...getTags(proxies, /新加坡|sg|singapore/i))
  }
  if (['us', 'us-auto'].includes(outbound.tag)) {
    outbound.outbounds.push(...getTags(proxies, /美国|us|unitedstates|united states/i))
  }

  outbound.outbounds = mergeOutbounds([], outbound.outbounds)
}

function getTags(proxies, regex) {
  return (regex ? proxies.filter(proxy => regex.test(proxy.tag)) : proxies).map(proxy => proxy.tag)
}

function expandPlaceholderOutbounds(outbound, proxies) {
  if (!Array.isArray(outbound.filter) || outbound.filter.length === 0) {
    return getTags(proxies)
  }

  let matched = proxies.slice()
  for (const rule of outbound.filter) {
    const keywords = normalizeKeywords(rule.keywords)
    if (keywords.length === 0) continue

    if (rule.action === 'include') {
      matched = matched.filter(proxy => matchesKeywords(proxy.tag, keywords))
    }
    if (rule.action === 'exclude') {
      matched = matched.filter(proxy => !matchesKeywords(proxy.tag, keywords))
    }
  }

  return matched.map(proxy => proxy.tag)
}

function normalizeKeywords(keywords) {
  if (!Array.isArray(keywords)) return []

  return keywords
    .flatMap(keyword => String(keyword).split('|'))
    .map(keyword => keyword.trim())
    .filter(Boolean)
}

function matchesKeywords(tag, keywords) {
  const lowerTag = String(tag).toLowerCase()
  return keywords.some(keyword => lowerTag.includes(keyword.toLowerCase()))
}

function mergeOutbounds(existing, additions) {
  const merged = []
  for (const tag of [...existing, ...additions]) {
    if (!merged.includes(tag)) {
      merged.push(tag)
    }
  }
  return merged
}
