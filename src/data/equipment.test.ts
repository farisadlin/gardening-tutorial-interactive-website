import { describe, it, expect } from 'vitest';
import { crops, getTutorial } from './garden';
import { getEquipment } from './equipment';
describe('growing equipment requirements', () => {
  const pak = crops[0];
  const ids = (system: 'nft'|'dft'|'wick'|'kratky'|'dwc'|'drip'|'dutch-bucket') => getEquipment(pak, 'hydro', system).filter(item => item.required).map(item => item.id);
  it('does not ask passive growers to buy powered circulation equipment', () => {
    for (const system of ['wick', 'kratky'] as const) {
      expect(ids(system)).not.toContain('water-pump');
      expect(ids(system)).not.toContain('air-pump');
      expect(ids(system)).not.toContain('controller');
    }
    expect(ids('wick')).toContain('wick');
    expect(ids('kratky')).toContain('net-pots');
  });
  it('distinguishes circulation, aeration and drip requirements', () => {
    expect(ids('nft')).toContain('water-pump');
    expect(ids('nft')).not.toContain('controller');
    for (const id of ['overflow', 'water-pump', 'air-pump', 'air-kit']) expect(ids('dft')).toContain(id);
    expect(ids('dwc')).toContain('air-pump');
    expect(ids('dwc')).not.toContain('water-pump');
    for (const id of ['drip-line', 'filter', 'controller', 'drain']) expect(ids('drip')).toContain(id);
  });
  it('adapts containers and supports to the crop and keeps soil tools distinct', () => {
    const chilli = crops.find(c => c.id === 'chilli')!;
    expect(getEquipment(chilli, 'soil').find(i => i.id === 'soil-pot')!.name.en).toContain(chilli.pot);
    expect(getEquipment(chilli, 'soil').some(i => i.id === 'stake')).toBe(true);
    expect(getEquipment(pak, 'soil').some(i => i.id === 'stake')).toBe(false);
    expect(getEquipment(pak, 'soil').some(i => i.id === 'ec-meter')).toBe(false);
    expect(getTutorial(chilli, 'hydro', 'drip').equipment.some(i => i.en.includes('Supporting stake'))).toBe(true);
  });
  it('includes bucket outlets, return plumbing and support for the chilli Dutch Bucket path', () => {
    const chilli = crops.find(c => c.id === 'chilli')!;
    const ids = getEquipment(chilli, 'hydro', 'dutch-bucket').map(item => item.id);
    for (const id of ['bato-buckets', 'bucket-outlets', 'water-pump', 'drip-line', 'filter', 'controller', 'stake']) expect(ids).toContain(id);
    const tutorial = getTutorial(chilli, 'hydro', 'dutch-bucket');
    expect(tutorial.id).toBe('chilli:hydro:dutch-bucket');
    expect(tutorial.sources.some(source => source.url.includes('em-9456'))).toBe(true);
  });
});
