import * as casbin from 'casbin';

const casbinModel = `
  [request_definition]
  r = sub, obj, act

  [policy_definition]
  p = sub, obj, act

  [role_definition]
  g = _, _

  [policy_effect]
  e = some(where (p.eft == allow))

  [matchers]
  m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
  `;

export async function createEnforcerWithPolicy(
  policies: string[][],
  groupingPolicies: string[][]
): Promise<casbin.Enforcer> {
  const model = casbin.newModelFromString(casbinModel);
  const enforcer = await casbin.newEnforcer(model);
  for (const policy of policies) {
    await enforcer.addPolicy(...policy);
  }
  for (const policy of groupingPolicies) {
    await enforcer.addGroupingPolicy(...policy);
  }
  return enforcer;
}