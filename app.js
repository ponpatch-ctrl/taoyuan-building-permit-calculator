const unitPrices = {
  rc: [8770, 10410, 12830, 15030, 17710, 18520, 19330, 20490],
  src: [12760, 16360, 17860, 19370, 20180, 21440, 22260],
  steel: [8000, 12830, 16780, 18430, 20210, 21100, 22120, 23010]
};
const rates = {
  general: [0.065, 0.055, 0.050, 0.045],
  public: [0.070, 0.060, 0.055, 0.050],
  special: [0.080, 0.070, 0.065, 0.060]
};
const money = value => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(value);
const number = id => Math.max(0, Number(document.getElementById(id).value) || 0);
const byId = id => document.getElementById(id);

function priceFor(structure, floors) {
  const values = unitPrices[structure];
  if (structure === 'rc') {
    if (floors <= 5) return values[0]; if (floors <= 8) return values[1]; if (floors <= 12) return values[2];
    if (floors <= 15) return values[3]; if (floors <= 20) return values[4]; if (floors <= 25) return values[5];
    if (floors <= 30) return values[6]; return values[7];
  }
  if (structure === 'src') {
    if (floors <= 10) return values[0]; if (floors <= 15) return values[1]; if (floors <= 20) return values[2];
    if (floors <= 25) return values[3]; if (floors <= 30) return values[4]; if (floors <= 35) return values[5]; return values[6];
  }
  if (floors === 1) return values[0]; if (floors <= 10) return values[1]; if (floors <= 15) return values[2];
  if (floors <= 20) return values[3]; if (floors <= 25) return values[4]; if (floors <= 30) return values[5];
  if (floors <= 35) return values[6]; return values[7];
}

function calculateArchitectFee(cost, category) {
  const limits = [3000000, 15000000, 60000000];
  const selectedRates = rates[category];
  let remaining = cost, previous = 0, fee = 0;
  limits.forEach((limit, index) => {
    const band = Math.min(Math.max(remaining, 0), limit - previous);
    fee += band * selectedRates[index]; remaining -= band; previous = limit;
  });
  if (remaining > 0) fee += remaining * selectedRates[3];
  return Math.round(fee);
}

function recalculate() {
  const floors = Math.max(1, Math.floor(number('above') + number('below')));
  const unitPrice = priceFor(byId('structure').value, floors);
  const pricedArea = number('area') + number('balcony') + number('flower');
  const building = pricedArea * unitPrice;
  const extras = number('earthwork') * 140 + number('fence') * 2150;
  const constructionCost = Math.floor((building + extras) / 10) * 10;
  const architectFee = calculateArchitectFee(constructionCost, byId('category').value);
  const filingPayment = Math.round(architectFee * .50);
  const permitTopUp = Math.round(architectFee * .20);
  const refundable = Math.round(architectFee * .27);

  byId('constructionCost').textContent = money(constructionCost);
  byId('architectFee').textContent = money(architectFee);
  byId('unitPriceNote').textContent = `單價 ${money(unitPrice)}／㎡，級距樓層 ${floors} 層`;
  byId('filingPayment').textContent = money(filingPayment);
  byId('permitTopUp').textContent = money(permitTopUp);
  byId('refundable').textContent = money(refundable);
}

document.querySelectorAll('input, select').forEach(element => element.addEventListener('input', recalculate));
document.querySelectorAll('select').forEach(element => element.addEventListener('change', recalculate));
recalculate();
