import {environment} from '../environments/environment';
import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: `${environment.KEYCLOAK_URL}`,
  realm: `${environment.KEYCLOAK_REALM}`,
  clientId: `${environment.KEYCLOAK_CLIENT_ID}`,
});
