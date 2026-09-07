export type PackageType = 'bulk' | 'bag_1kg' | 'bag_250g' | 'drip_box' | 'custom'
export type ChannelType = 'unallocated' | 'bar' | 'b2c' | 'b2b'
export type StatusType = 'in_stock' | 'shipped' | 'sold' | 'consumed'

export function computeQuantityKg(
  packageType: PackageType,
  unitCount: number | null,
  rawQuantityKg: number = 0,
  customSizeG?: number | null
): number {
  if (packageType === 'bulk') return Number(rawQuantityKg) || 0
  const count = Number(unitCount) || 0
  if (packageType === 'bag_1kg') return Math.round(count * 1.0 * 100) / 100
  if (packageType === 'bag_250g') return Math.round(count * 0.25 * 100) / 100
  if (packageType === 'drip_box') return Math.round(count * 0.075 * 1000) / 1000 // 75g per box
  if (packageType === 'custom' && customSizeG) {
    return Math.round(count * (customSizeG / 1000) * 100) / 100
  }
  return Number(rawQuantityKg) || 0
}