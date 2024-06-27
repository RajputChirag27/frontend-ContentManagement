import { Component } from '@angular/core';
import { MediaService } from 'src/app/core/services/media.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss']
})
export class MediaFormComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress: number | null = null;

  constructor(
    private fb: FormBuilder,
    private _mediaService: MediaService,
    private toastr: ToastrService
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      tags: [''],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.patchValue({ file: file });
    }
  }

  onUpload() {
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = {
        title: this.uploadForm.get('title')?.value,
        description: this.uploadForm.get('description')?.value,
        tags: this.uploadForm.get('tags')?.value
      };

      this._mediaService.upload(this.selectedFile, formData)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            if(event.total)
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadProgress = null;
            this.toastr.success('Media Uploaded Successfully', 'Success!', {
              timeOut: 3000,
              closeButton: true,
              progressBar: true,
            });
          }
        }, error => {
          this.uploadProgress = null;
          this.toastr.error(`Upload Failed: ${error.message}`, 'Error!', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
        });
    }
  }
}
