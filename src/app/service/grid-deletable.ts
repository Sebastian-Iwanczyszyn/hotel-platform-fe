import {Observable} from 'rxjs';

export interface GridDeletable {
  delete(id: string): Observable<void>;
}
