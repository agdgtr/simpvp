
// Variables to store current selections
let attackerTier = 'T1';
let attackerType = 'Siege';
let attackerAmount = 0;
let defenderTier = 'T1';
let defenderType = 'Siege';
let defenderAmount = 0;

// Variables to store buff values
let attackerAttackPercentBuff = 0;
let attackerAttackFlatBuff = 0;
let attackerDefensePercentBuff = 0;
let attackerDefenseFlatBuff = 0;
let attackerHPPercentBuff = 0;
let attackerHPFlatBuff = 0;

let defenderAttackPercentBuff = 0;
let defenderAttackFlatBuff = 0;
let defenderDefensePercentBuff = 0;
let defenderDefenseFlatBuff = 0;
let defenderHPPercentBuff = 0;
let defenderHPFlatBuff = 0;

// Variable to store troop data
let troopData = [];

// Parse CSV data
async function loadTroopData() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/andresgarca361/tbfgdsdaf@main/troops%20-%20troops.csv%20%281%29.csv')


    const csvText = await response.text();
    const lines = csvText.split('\n');

    // Find header line and get column indices
    let headerIndex = -1;
    let headers = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('raw_troop_name') && lines[i].includes('troop_tier')) {
        headerIndex = i;
        headers = lines[i].split(',');
        break;
      }
    }

    if (headerIndex === -1) return;

    // Get column indices
    const nameIndex = headers.indexOf('raw_troop_name');
    const tierIndex = headers.indexOf('troop_tier');
    const typeIndex = headers.indexOf('troop_type');
    const attackIndex = headers.indexOf('attack');
    const defenseIndex = headers.indexOf('defense');
    const hpIndex = headers.indexOf('hit_points');
    const rangeIndex = headers.indexOf('range');
    const speedIndex = headers.indexOf('speed');
    const loadIndex = headers.indexOf('load');
    const vsGroundIndex = headers.indexOf('k_vs_ground_%');
    const vsArcherIndex = headers.indexOf('k_vs_archer_%');
    const vsMountedIndex = headers.indexOf('k_vs_mounted_%');
    const vsSiegeIndex = headers.indexOf('k_vs_siege_%');

    // Parse data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length > Math.max(nameIndex, tierIndex, typeIndex, attackIndex, defenseIndex, hpIndex, rangeIndex, speedIndex, loadIndex, vsGroundIndex, vsArcherIndex, vsMountedIndex, vsSiegeIndex)) {
        const troop = {
          name: row[nameIndex],
          tier: parseInt(row[tierIndex]),
          type: row[typeIndex],
          attack: parseInt(row[attackIndex]) || 0,
          defense: parseInt(row[defenseIndex]) || 0,
          hp: parseInt(row[hpIndex]) || 0,
          range: parseInt(row[rangeIndex]) || 0,
          speed: parseInt(row[speedIndex]) || 0,
          load: parseFloat(row[loadIndex]) || 0,
          vsGround: parseInt(row[vsGroundIndex]) || 100,
          vsArcher: parseInt(row[vsArcherIndex]) || 100,
          vsMounted: parseInt(row[vsMountedIndex]) || 100,
          vsSiege: parseInt(row[vsSiegeIndex]) || 100
        };

        // Only add valid troop entries
        if (troop.name && troop.tier && troop.type) {
          troopData.push(troop);
        }
      }
    }

    console.log('Loaded troop data:', troopData.length, 'entries');
    updateTroopStats();
  } catch (error) {
    console.error('Error loading troop data:', error);
  }
}

// Function to find troop by tier and type
function findTroop(tier, type) {
  const tierNum = parseInt(tier.replace('T', ''));
  const typeMap = {
    'Siege': 'siege',
    'Ground': 'ground', 
    'Mounted': 'mounted',
    'Ranged': 'archer'
  };

  const searchType = typeMap[type] || type.toLowerCase();

    // Assuming 'troopData' is globally available or passed in
    return troopData.find(troop =>
      troop.tier === tierNum &&
      // Check if the troop type starts with the searchType (e.g., 'archer_')
      troop.type.toLowerCase().startsWith(searchType) &&
      // AND explicitly exclude 'archer_tower'
      !troop.type.toLowerCase().includes('archer_tower')
    );
  }
// Function to calculate buffed stats
function calculateBuffedStats(baseStat, percentBuff, flatBuff) {
  // Apply percentage buff first
  const afterPercent = baseStat * (1 + percentBuff / 100);
  // Then add flat buff
  return Math.floor(afterPercent + flatBuff);
}

// Function to update troop stats display
function updateTroopStats() {
  updateAttackerStats();
  updateDefenderStats();
}

function updateAttackerStats() {
  const troop = findTroop(attackerTier, attackerType);

  if (troop) {
    const buffedAttack = calculateBuffedStats(troop.attack, attackerAttackPercentBuff, attackerAttackFlatBuff);
    const buffedDefense = calculateBuffedStats(troop.defense, attackerDefensePercentBuff, attackerDefenseFlatBuff);
    const buffedHP = calculateBuffedStats(troop.hp, attackerHPPercentBuff, attackerHPFlatBuff);

    document.getElementById('attackerAttack').textContent = buffedAttack.toLocaleString();
    document.getElementById('attackerDefense').textContent = buffedDefense.toLocaleString();
    document.getElementById('attackerHP').textContent = buffedHP.toLocaleString();
    document.getElementById('attackerRange').textContent = troop.range;
    document.getElementById('attackerSpeed').textContent = troop.speed;
    document.getElementById('attackerLoad').textContent = troop.load;
    document.getElementById('attackerVsGround').textContent = troop.vsGround;
    document.getElementById('attackerVsArcher').textContent = troop.vsArcher;
    document.getElementById('attackerVsMounted').textContent = troop.vsMounted;
    document.getElementById('attackerVsSiege').textContent = troop.vsSiege;
  } else {
    document.getElementById('attackerAttack').textContent = '-';
    document.getElementById('attackerDefense').textContent = '-';
    document.getElementById('attackerHP').textContent = '-';
    document.getElementById('attackerRange').textContent = '-';
    document.getElementById('attackerSpeed').textContent = '-';
    document.getElementById('attackerLoad').textContent = '-';
    document.getElementById('attackerVsGround').textContent = '-';
    document.getElementById('attackerVsArcher').textContent = '-';
    document.getElementById('attackerVsMounted').textContent = '-';
    document.getElementById('attackerVsSiege').textContent = '-';
  }
}

function updateDefenderStats() {
  const troop = findTroop(defenderTier, defenderType);

  if (troop) {
    const buffedAttack = calculateBuffedStats(troop.attack, defenderAttackPercentBuff, defenderAttackFlatBuff);
    const buffedDefense = calculateBuffedStats(troop.defense, defenderDefensePercentBuff, defenderDefenseFlatBuff);
    const buffedHP = calculateBuffedStats(troop.hp, defenderHPPercentBuff, defenderHPFlatBuff);

    document.getElementById('defenderAttack').textContent = buffedAttack.toLocaleString();
    document.getElementById('defenderDefense').textContent = buffedDefense.toLocaleString();
    document.getElementById('defenderHP').textContent = buffedHP.toLocaleString();
    document.getElementById('defenderRange').textContent = troop.range;
    document.getElementById('defenderSpeed').textContent = troop.speed;
    document.getElementById('defenderLoad').textContent = troop.load;
    document.getElementById('defenderVsGround').textContent = troop.vsGround;
    document.getElementById('defenderVsArcher').textContent = troop.vsArcher;
    document.getElementById('defenderVsMounted').textContent = troop.vsMounted;
    document.getElementById('defenderVsSiege').textContent = troop.vsSiege;
  } else {
    document.getElementById('defenderAttack').textContent = '-';
    document.getElementById('defenderDefense').textContent = '-';
    document.getElementById('defenderHP').textContent = '-';
    document.getElementById('defenderRange').textContent = '-';
    document.getElementById('defenderSpeed').textContent = '-';
    document.getElementById('defenderLoad').textContent = '-';
    document.getElementById('defenderVsGround').textContent = '-';
    document.getElementById('defenderVsArcher').textContent = '-';
    document.getElementById('defenderVsMounted').textContent = '-';
    document.getElementById('defenderVsSiege').textContent = '-';
  }
}

// Get references to form elements
const attackerTierSelect = document.getElementById('attackerTier');
const attackerTypeSelect = document.getElementById('attackerType');
const attackerAmountInput = document.getElementById('attackerAmount');
const defenderTierSelect = document.getElementById('defenderTier');
const defenderTypeSelect = document.getElementById('defenderType');
const defenderAmountInput = document.getElementById('defenderAmount');

// Get references to buff input elements
const attackerAttackPercentBuffInput = document.getElementById('attackerAttackPercentBuff');
const attackerAttackFlatBuffInput = document.getElementById('attackerAttackFlatBuff');
const attackerDefensePercentBuffInput = document.getElementById('attackerDefensePercentBuff');
const attackerDefenseFlatBuffInput = document.getElementById('attackerDefenseFlatBuff');
const attackerHPPercentBuffInput = document.getElementById('attackerHPPercentBuff');
const attackerHPFlatBuffInput = document.getElementById('attackerHPFlatBuff');

const defenderAttackPercentBuffInput = document.getElementById('defenderAttackPercentBuff');
const defenderAttackFlatBuffInput = document.getElementById('defenderAttackFlatBuff');
const defenderDefensePercentBuffInput = document.getElementById('defenderDefensePercentBuff');
const defenderDefenseFlatBuffInput = document.getElementById('defenderDefenseFlatBuff');
const defenderHPPercentBuffInput = document.getElementById('defenderHPPercentBuff');
const defenderHPFlatBuffInput = document.getElementById('defenderHPFlatBuff');

// Add event listeners to track changes
attackerTierSelect.addEventListener('change', function() {
  attackerTier = this.value;
  console.log('Attacker Tier:', attackerTier);
  updateAttackerStats();
});

attackerTypeSelect.addEventListener('change', function() {
  attackerType = this.value;
  console.log('Attacker Type:', attackerType);
  updateAttackerStats();
});

attackerAmountInput.addEventListener('input', function() {
  attackerAmount = parseInt(this.value) || 0;
  console.log('Attacker Amount:', attackerAmount);
});

defenderTierSelect.addEventListener('change', function() {
  defenderTier = this.value;
  console.log('Defender Tier:', defenderTier);
  updateDefenderStats();
});

defenderTypeSelect.addEventListener('change', function() {
  defenderType = this.value;
  console.log('Defender Type:', defenderType);
  updateDefenderStats();
});

defenderAmountInput.addEventListener('input', function() {
  defenderAmount = parseInt(this.value) || 0;
  console.log('Defender Amount:', defenderAmount);
});

// Add event listeners for buff inputs
attackerAttackPercentBuffInput.addEventListener('input', function() {
  attackerAttackPercentBuff = parseFloat(this.value) || 0;
  updateAttackerStats();
});

attackerAttackFlatBuffInput.addEventListener('input', function() {
  attackerAttackFlatBuff = parseInt(this.value) || 0;
  updateAttackerStats();
});

attackerDefensePercentBuffInput.addEventListener('input', function() {
  attackerDefensePercentBuff = parseFloat(this.value) || 0;
  updateAttackerStats();
});

attackerDefenseFlatBuffInput.addEventListener('input', function() {
  attackerDefenseFlatBuff = parseInt(this.value) || 0;
  updateAttackerStats();
});

attackerHPPercentBuffInput.addEventListener('input', function() {
  attackerHPPercentBuff = parseFloat(this.value) || 0;
  updateAttackerStats();
});

attackerHPFlatBuffInput.addEventListener('input', function() {
  attackerHPFlatBuff = parseInt(this.value) || 0;
  updateAttackerStats();
});

defenderAttackPercentBuffInput.addEventListener('input', function() {
  defenderAttackPercentBuff = parseFloat(this.value) || 0;
  updateDefenderStats();
});

defenderAttackFlatBuffInput.addEventListener('input', function() {
  defenderAttackFlatBuff = parseInt(this.value) || 0;
  updateDefenderStats();
});

defenderDefensePercentBuffInput.addEventListener('input', function() {
  defenderDefensePercentBuff = parseFloat(this.value) || 0;
  updateDefenderStats();
});

defenderDefenseFlatBuffInput.addEventListener('input', function() {
  defenderDefenseFlatBuff = parseInt(this.value) || 0;
  updateDefenderStats();
});

defenderHPPercentBuffInput.addEventListener('input', function() {
  defenderHPPercentBuff = parseFloat(this.value) || 0;
  updateDefenderStats();
});

defenderHPFlatBuffInput.addEventListener('input', function() {
  defenderHPFlatBuff = parseInt(this.value) || 0;
  updateDefenderStats();
});

// Function to get current selections (you can call this anytime)
function getCurrentSelections() {
  return {
    attacker: {
      tier: attackerTier,
      type: attackerType,
      amount: attackerAmount
    },
    defender: {
      tier: defenderTier,
      type: defenderType,
      amount: defenderAmount
    }
  };
}

function logCurrentSelections() {
  console.log('Current Selections:', {
    attacker: {
      tier: attackerTier,
      type: attackerType,
      amount: attackerAmount
    },
    defender: {
      tier: defenderTier,
      type: defenderType,
      amount: defenderAmount
    }
  });
}

// Load troop data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadTroopData();
});

logCurrentSelections();
console.log(getCurrentSelections());

function calculate() {
  let battleLog = [];
  const attackerTroop = findTroop(attackerTier, attackerType);
  const defenderTroop = findTroop(defenderTier, defenderType);

  if (!attackerTroop || !defenderTroop) {
    console.log('Cannot calculate: Missing troop data');
    return;
  }

  let currentAttackerAmount = attackerAmount;
  let currentDefenderAmount = defenderAmount;
  const attackerStartAmount = attackerAmount;
  const defenderStartAmount = defenderAmount;

  let attWounds = 0;
  let defWounds = 0;
  let rounds = 0;
  let attackerPosition = 1500;
  let defenderPosition = 0;
  let result = '';

  const attackerBaseAttack = calculateBuffedStats(attackerTroop.attack, attackerAttackPercentBuff, attackerAttackFlatBuff);
  const attackerBaseDefense = calculateBuffedStats(attackerTroop.defense, attackerDefensePercentBuff, attackerDefenseFlatBuff);
  const attackerBaseHP = calculateBuffedStats(attackerTroop.hp, attackerHPPercentBuff, attackerHPFlatBuff);

  const defenderBaseAttack = calculateBuffedStats(defenderTroop.attack, defenderAttackPercentBuff, defenderAttackFlatBuff);
  const defenderBaseDefense = calculateBuffedStats(defenderTroop.defense, defenderDefensePercentBuff, defenderDefenseFlatBuff);
  const defenderBaseHP = calculateBuffedStats(defenderTroop.hp, defenderHPPercentBuff, defenderHPFlatBuff);

  const modifierDeff = defenderTroop[`vs${attackerType}`] / 100 || 1;
  const modifierAtt = attackerTroop[`vs${defenderType}`] / 100 || 1;

  const MAX_ROUNDS = 100000;

  while (rounds < MAX_ROUNDS) {
    rounds++;
    battleLog.push(`Round ${rounds}:`);
    battleLog.push(`  Attacker Position: ${attackerPosition}, Defender Position: ${defenderPosition}`);
    let combatOccurredThisRound = false;

    let currentTotalAttackerAttack = attackerBaseAttack * currentAttackerAmount;
    let currentTotalAttackerDefense = attackerBaseDefense * currentAttackerAmount;
    let currentTotalDefenderAttack = defenderBaseAttack * currentDefenderAmount;
    let currentTotalDefenderDefense = defenderBaseDefense * currentDefenderAmount;

    if (currentAttackerAmount <= 0) {
      result = `Final: ${rounds - 1} rounds\nDefenders win with ${currentDefenderAmount.toFixed(2)} left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
      break;
    }
    if (currentDefenderAmount <= 0) {
      result = `Final: ${rounds - 1} rounds\nAttackers win with ${currentAttackerAmount.toFixed(2)} left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
      break;
    }

    // Defender's turn (goes first)
    if (currentDefenderAmount > 0) {
      if (defenderPosition + defenderTroop.range >= attackerPosition) {
        // Already in range, attack only
        const damageDealtDef = modifierDeff * currentDefenderAmount * (defenderBaseAttack ** 2) / (defenderBaseAttack + attackerBaseDefense);
        const killedAtt = damageDealtDef / attackerBaseHP;
        let currentattWounds = Math.min(killedAtt, currentAttackerAmount);
        battleLog.push(`  Defender attacks: Deals ${damageDealtDef.toFixed(2)} damage, kills ${currentattWounds.toFixed(2)} attackers`);
        if (killedAtt >= currentAttackerAmount) {
          attWounds += currentAttackerAmount;
          currentAttackerAmount = 0;
          combatOccurredThisRound = true;
        } else {
          currentAttackerAmount -= killedAtt;
          attWounds += killedAtt;
          if (attackerPosition - attackerTroop.range <= defenderPosition) {
            const counteratt = modifierAtt * currentattWounds * (attackerBaseAttack ** 2) / (attackerBaseAttack + defenderBaseDefense);
            const killeddef = counteratt / defenderBaseHP;
            currentDefenderAmount -= killeddef;
            defWounds += killeddef;
            battleLog.push(`  Attacker counterattacks: Deals ${counteratt.toFixed(2)} damage, kills ${killeddef.toFixed(2)} defenders`);
          }
          combatOccurredThisRound = true;
        }
      } else if (defenderPosition + (defenderTroop.range + defenderTroop.speed) >= attackerPosition) {
        // Can move into range, move and attack
        defenderPosition = attackerPosition - defenderTroop.range;
        battleLog.push(`  Defender moves to position ${defenderPosition} and attacks`);
        const damageDealtDef = modifierDeff * currentDefenderAmount * (defenderBaseAttack ** 2) / (defenderBaseAttack + attackerBaseDefense);
        const killedAtt = damageDealtDef / attackerBaseHP;
        let currentattWounds = Math.min(killedAtt, currentAttackerAmount);
        battleLog.push(`  Defender attacks: Deals ${damageDealtDef.toFixed(2)} damage, kills ${currentattWounds.toFixed(2)} attackers`);
        if (killedAtt >= currentAttackerAmount) {
          attWounds += currentAttackerAmount;
          currentAttackerAmount = 0;
          combatOccurredThisRound = true;
        } else {
          currentAttackerAmount -= killedAtt;
          attWounds += killedAtt;
          if (attackerPosition - attackerTroop.range <= defenderPosition) {
            const counteratt = modifierAtt * currentattWounds * (attackerBaseAttack ** 2) / (attackerBaseAttack + defenderBaseDefense);
            const killeddef = counteratt / defenderBaseHP;
            currentDefenderAmount -= killeddef;
            defWounds += killeddef;
            battleLog.push(`  Attacker counterattacks: Deals ${counteratt.toFixed(2)} damage, kills ${killeddef.toFixed(2)} defenders`);
          }
          combatOccurredThisRound = true;
        }
      } else {
        // Move forward
        defenderPosition += defenderTroop.speed;
        battleLog.push(`  Defender moves: New position ${defenderPosition}`);
      }
    }

    if (currentAttackerAmount <= 0) {
      result = `Final: ${rounds} rounds\nDefenders win with ${currentDefenderAmount.toFixed(2)} left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
      break;
    }

    // Attacker's turn
    if (currentAttackerAmount > 0) {
      if (attackerPosition - attackerTroop.range <= defenderPosition) {
        // Already in range, attack only
        const damageDealtAtt = modifierAtt * currentAttackerAmount * (attackerBaseAttack ** 2) / (attackerBaseAttack + defenderBaseDefense);
        const killedDef = damageDealtAtt / defenderBaseHP;
        let currentdefWounds = Math.min(killedDef, currentDefenderAmount);
        battleLog.push(`  Attacker attacks: Deals ${damageDealtAtt.toFixed(2)} damage, kills ${currentdefWounds.toFixed(2)} defenders`);
        if (killedDef >= currentDefenderAmount) {
          defWounds += currentDefenderAmount;
          currentDefenderAmount = 0;
          combatOccurredThisRound = true;
        } else {
          currentDefenderAmount -= killedDef;
          defWounds += killedDef;
          if (defenderPosition + defenderTroop.range >= attackerPosition) {
            const counterdeff = modifierDeff * currentdefWounds * (defenderBaseAttack ** 2) / (defenderBaseAttack + attackerBaseDefense);
            const killedatt = counterdeff / attackerBaseHP;
            currentAttackerAmount -= killedatt;
            battleLog.push(`  Defender counterattacks: Deals ${counterdeff.toFixed(2)} damage, kills ${killedatt.toFixed(2)} attackers`);
            attWounds += killedatt;
          }
          combatOccurredThisRound = true;
        }
      } else if (attackerPosition - (attackerTroop.range + attackerTroop.speed) <= defenderPosition) {
        // Can move into range, move and attack
        attackerPosition = defenderPosition + attackerTroop.range;
        battleLog.push(`  Attacker moves to position ${attackerPosition} and attacks`);
        const damageDealtAtt = modifierAtt * currentAttackerAmount * (attackerBaseAttack ** 2) / (attackerBaseAttack + defenderBaseDefense);
        const killedDef = damageDealtAtt / defenderBaseHP;
        let currentdefWounds = Math.min(killedDef, currentDefenderAmount);
        battleLog.push(`  Attacker attacks: Deals ${damageDealtAtt.toFixed(2)} damage, kills ${currentdefWounds.toFixed(2)} defenders`);
        if (killedDef >= currentDefenderAmount) {
          defWounds += currentDefenderAmount;
          currentDefenderAmount = 0;
          combatOccurredThisRound = true;
        } else {
          currentDefenderAmount -= killedDef;
          defWounds += killedDef;
          if (defenderPosition + defenderTroop.range >= attackerPosition) {
            const counterdeff = modifierDeff * currentdefWounds * (defenderBaseAttack ** 2) / (defenderBaseAttack + attackerBaseDefense);
            const killedatt = counterdeff / attackerBaseHP;
            currentAttackerAmount -= killedatt;
            battleLog.push(`  Defender counterattacks: Deals ${counterdeff.toFixed(2)} damage, kills ${killedatt.toFixed(2)} attackers`);
            attWounds += killedatt;
          }
          combatOccurredThisRound = true;
        }
      } else {
        // Move forward
        attackerPosition -= attackerTroop.speed;
        battleLog.push(`  Attacker moves: New position ${attackerPosition}`);
      }
    }

    if (currentDefenderAmount <= 0) {
      result = `Final: ${rounds} rounds\nAttackers win with ${currentAttackerAmount.toFixed(2)} left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
      break;
    }

    battleLog.push(`  Remaining: Attackers=${currentAttackerAmount.toFixed(2)}, Defenders=${currentDefenderAmount.toFixed(2)}`);
  }

  attWounds = Math.min(attWounds, attackerStartAmount);
  defWounds = Math.min(defWounds, defenderStartAmount);

  if (rounds >= MAX_ROUNDS) {
    if (currentAttackerAmount > currentDefenderAmount) {
      result = `Final: ${MAX_ROUNDS} rounds (Max rounds reached)\nAttackers win with ${currentAttackerAmount.toFixed(2)} left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
    } else if (currentDefenderAmount > currentAttackerAmount) {
      result = `Final: ${MAX_ROUNDS} rounds (Max rounds reached)\nDefenders win with ${currentDefenderAmount.toFixed(2)} left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
    } else {
      result = `Final: ${MAX_ROUNDS} rounds (Max rounds reached)\nDraw. Both sides have ${currentAttackerAmount.toFixed(2)} troops left.\nAttacker wounds: ${Math.floor(attWounds)} / ${attackerStartAmount}\nDefender wounds: ${Math.floor(defWounds)} / ${defenderStartAmount}`;
    }
    battleLog.push(`  Remaining: Attackers=${currentAttackerAmount.toFixed(2)}, Defenders=${currentDefenderAmount.toFixed(2)}`);
  }

  console.log(result);
  console.log(battleLog.join('\n'));
  document.getElementById('battleResult').textContent = result + '\n\n' + battleLog.join('\n');
}