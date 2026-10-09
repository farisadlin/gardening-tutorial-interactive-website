import assert from 'node:assert/strict';
import { crops, tutorials, stages, type Localized } from '../src/data/garden';
import { defaultSystem, hydroSystems, systemSupport } from '../src/data/hydroSystems';
import { growingTargets, solutionTemperature, targetSources } from '../src/data/growingTargets';
import { getEquipment } from '../src/data/equipment';
import { scenePresets } from '../src/components/sceneConfig';
function bilingual(value: Localized, field: string) {
  for (const lang of ['en', 'id'] as const) assert.ok(typeof value[lang] === 'string' && value[lang].trim().length > 0, `${field} missing ${lang}`);
}
assert.equal(crops.length, 6);
assert.equal(new Set(crops.map(c => c.id)).size, 6);
assert.equal(hydroSystems.length, 7);
assert.equal(new Set(hydroSystems.map(s => s.id)).size, 7);
assert.equal(new Set(tutorials.map(t => t.id)).size, tutorials.length);
for (const system of hydroSystems) {
  for (const key of ['name', 'fullName', 'description', 'power', 'difficulty', 'advantage', 'caution', 'setup', 'transfer', 'care', 'problem', 'cleanup', 'rootLabel', 'rootExplanation', 'quizQuestion', 'quizCorrect', 'quizWrong'] as const) bilingual(system[key], `${system.id}.${key}`);
  system.equipment.forEach((e, i) => bilingual(e, `${system.id}.equipment.${i}`));
  assert.ok(system.source.url.startsWith('https://'));
}
assert.deepEqual(Object.keys(growingTargets).sort(), crops.map(c => c.id).sort());
for (const crop of crops) {
  assert.equal(crop.harvestBasis, 'sowing');
  const target = growingTargets[crop.id];
  bilingual(target.note, `${crop.id}.targets.note`);
  for (const key of ['ph', 'ec', 'air'] as const) {
    assert.equal(target[key].length, 2);
    assert.ok(target[key].every(Number.isFinite));
    assert.ok(target[key][0] > 0 && target[key][0] <= target[key][1]);
  }
  assert.ok(target.ph[1] <= 14);
  assert.ok(solutionTemperature[0] <= solutionTemperature[1]);
  targetSources(crop.id, true).forEach(source => assert.ok(source.title && source.url.startsWith('https://')));
  for (const key of ['name', 'description', 'category', 'space', 'light', 'climate', 'sow', 'transplant', 'care', 'issue', 'harvest'] as const) bilingual(crop[key], `${crop.id}.${key}`);
  assert.ok(crop.source.url.startsWith('https://'));
  const paths = tutorials.filter(t => t.cropId === crop.id);
  assert.equal(paths.filter(t => t.method === 'soil').length, 1);
  assert.equal(paths.filter(t => t.method === 'hydro').length, hydroSystems.filter(s => systemSupport(crop, s.id).available).length);
  assert.ok(paths.find(t => t.id === `${crop.id}:hydro` && t.systemId === defaultSystem(crop)));
  for (const tutorial of paths) {
    assert.deepEqual(tutorial.steps.map(s => s.id), stages);
    const equipment = getEquipment(crop, tutorial.method, tutorial.systemId);
    assert.equal(new Set(equipment.map(item => item.id)).size, equipment.length);
    for (const item of equipment) {
      bilingual(item.name, `${tutorial.id}.equipment.${item.id}.name`);
      bilingual(item.purpose, `${tutorial.id}.equipment.${item.id}.purpose`);
      assert.ok(['grow', 'measure', 'care'].includes(item.group));
      assert.equal(typeof item.required, 'boolean');
    }
    tutorial.equipment.forEach((e, i) => bilingual(e, `${tutorial.id}.equipment.${i}`));
    assert.ok(tutorial.sources.length >= 2);
    for (const step of tutorial.steps) {
      for (const key of ['title', 'intro', 'tip'] as const) bilingual(step[key], `${tutorial.id}.${step.id}.${key}`);
      assert.equal(step.tasks.length, 3);
      step.tasks.forEach((task, i) => bilingual(task, `${tutorial.id}.${step.id}.task.${i}`));
      bilingual(step.quiz.question, `${tutorial.id}.${step.id}.quiz`);
      bilingual(step.quiz.explanation, `${tutorial.id}.${step.id}.explanation`);
      step.quiz.choices.forEach(c => bilingual(c, `${tutorial.id}.${step.id}.choice`));
      assert.ok(step.quiz.correct >= 0 && step.quiz.correct < step.quiz.choices.length);
      assert.equal(step.scene, step.id);
      assert.ok(scenePresets[step.scene]);
    }
  }
}
console.log(`Validated ${crops.length} crops, ${hydroSystems.length} hydroponic systems, ${tutorials.length} bilingual paths, ${tutorials.length * 6} steps and ${tutorials.length * 18} tasks.`);
