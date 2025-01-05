import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
} from '@loopback/authorization';
import { RESOURCE } from '../keys';

/**
 * Instance-level authorizer for endpoints with instance-specific resource IDs.
 * It binds a unique resource identifier to the authorization context.
 * 
 * @param authorizationCtx - The authorization context containing invocation details.
 * @param metadata - The metadata providing resource and scope details.
 * @returns AuthorizationDecision.ABSTAIN as this function does not make decisions.
 * @throws {Error} If the resource ID is missing or invalid.
 */

export async function assignResourceInstanceId(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
) {
  const resourceId = authorizationCtx.invocationContext.args[0];
  
  const resource = getResourceName(
    metadata.resource ?? authorizationCtx.resource,
    resourceId,
  );
  // resource will override the resource name from metadata
  authorizationCtx.invocationContext.bind(RESOURCE).to(resource);
  return AuthorizationDecision.ABSTAIN;
}

/**
 * Generate the resource name according to the naming convention
 * in casbin policy
 * @param resource resource name
 * @param id resource instance's id
 */
function getResourceName(resource: string, id?: number): string {
  // instance level name with specific id
  if (id) return `${resource}${id}`;
  // class level name with wildcard
  return `${resource}*`;
}
