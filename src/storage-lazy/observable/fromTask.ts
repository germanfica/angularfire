import { Observable } from 'rxjs';
import { UploadTask, UploadTaskSnapshot } from '../interfaces';

export function fromTask(task: UploadTask) {
  return new Observable<UploadTaskSnapshot>(subscriber => {
    const progress = (snap: UploadTaskSnapshot) => subscriber.next(snap);
    const error = e => subscriber.error(e);
    const complete = () => subscriber.complete();
    progress(task.snapshot);
    task.on('state_changed', progress, (e) => {
      progress(task.snapshot);
      error(e);
    }, () => {
      progress(task.snapshot);
      complete();
    });
    return () => task.cancel();
  });
}