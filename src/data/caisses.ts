export interface CaisseRegionale {
  value: string;
  label: string;
}

// Liste officielle (credit-agricole.fr — get-cr-list.json), hors Chalus
export const CAISSES: CaisseRegionale[] = [
  { value: '/ca-alpesprovence/', label: 'Alpes Provence' },
  { value: '/ca-alsace-vosges/', label: 'Alsace Vosges' },
  { value: '/ca-anjou-maine/', label: 'Anjou Maine' },
  { value: '/ca-aquitaine/', label: 'Aquitaine' },
  { value: '/ca-atlantique-vendee/', label: 'Atlantique Vendée' },
  { value: '/ca-briepicardie/', label: 'Brie Picardie' },
  { value: '/ca-centrest/', label: 'Centre Est' },
  { value: '/ca-centrefrance/', label: 'Centre France' },
  { value: '/ca-centreloire/', label: 'Centre Loire' },
  { value: '/ca-centreouest/', label: 'Centre Ouest' },
  { value: '/ca-cb/', label: 'Champagne Bourgogne' },
  { value: '/ca-charente-perigord/', label: 'Charente Périgord' },
  { value: '/ca-cmds/', label: 'Charente-Maritime Deux-Sèvres' },
  { value: '/ca-corse/', label: 'Corse' },
  { value: '/ca-cotesdarmor/', label: "Côtes d'Armor" },
  { value: '/ca-des-savoie/', label: 'Des Savoie' },
  { value: '/ca-finistere/', label: 'Finistère' },
  { value: '/ca-franchecomte/', label: 'Franche Comté' },
  { value: '/ca-guadeloupe/', label: 'Guadeloupe' },
  { value: '/ca-illeetvilaine/', label: 'Ille et Vilaine' },
  { value: '/ca-languedoc/', label: 'Languedoc' },
  { value: '/ca-loirehauteloire/', label: 'Loire Haute-Loire' },
  { value: '/ca-lorraine/', label: 'Lorraine' },
  { value: '/ca-martinique/', label: 'Martinique Guyane' },
  { value: '/ca-morbihan/', label: 'Morbihan' },
  { value: '/ca-norddefrance/', label: 'Nord De France' },
  { value: '/ca-nord-est/', label: 'Nord Est' },
  { value: '/ca-nmp/', label: 'Nord Midi Pyrénées' },
  { value: '/ca-normandie/', label: 'Normandie' },
  { value: '/ca-normandie-seine/', label: 'Normandie Seine' },
  { value: '/ca-paris/', label: 'Paris' },
  { value: '/ca-pca/', label: "Provence Côte d'Azur" },
  { value: '/ca-pyrenees-gascogne/', label: 'Pyrénées Gascogne' },
  { value: '/ca-reunion/', label: 'Réunion - Mayotte' },
  { value: '/ca-sudmed/', label: 'Sud Méditerranée' },
  { value: '/ca-sudrhonealpes/', label: 'Sud Rhône Alpes' },
  { value: '/ca-toulouse31/', label: 'Toulouse 31' },
  { value: '/ca-tourainepoitou/', label: 'Touraine Poitou' },
  { value: '/ca-valdefrance/', label: 'Val De France' },
];

export function getCaisseLabel(value: string): string {
  return CAISSES.find(c => c.value === value)?.label ?? value;
}
