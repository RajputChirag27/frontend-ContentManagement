import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContentService } from 'src/app/core/services/content.service';
import { ColDef } from 'ag-grid-community';
import { MediaService } from 'src/app/core/services/media.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private _articleService: ContentService,
    private toastr: ToastrService,
    private router: Router,
    private _mediaService: MediaService,
    private ngZone: NgZone
  ) {}

  rowData: any[] = [];
  mediaData: any[] = [];
  defaultColDef = {
    sortable: true,
    filter: true
  };

  mediaDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'fileType', headerName: 'FileType', flex: 1 },
    { field: 'fileSize', headerName: 'FileSize', flex: 1, },
    {
      headerName: 'Actions',
      cellRenderer: this.actionsRenderer,
      cellRendererParams: {
        viewPage: this.viewMediaPage.bind(this),
        updateItem: this.updateMediaItem.bind(this),
        deleteItem: this.deleteMediaItem.bind(this)
      },
      autoHeight: true,
      flex: 3
    }
  ];

  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'author', headerName: 'Author', flex: 1 },
    {
      headerName: 'Actions',
      cellRenderer: this.actionsRenderer,
      cellRendererParams: {
        viewPage: this.viewPage.bind(this),
        updateItem: this.updateItem.bind(this),
        deleteItem: this.deleteItem.bind(this)
      },
      autoHeight: true,
      flex: 3
    }
  ];

  ngOnInit(): void {
    this.loadArticles();
    this.loadMedia();
  }

  loadMedia(): void {
    this._mediaService.getMedia().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success && Array.isArray(response.result)) {
          this.mediaData = response.result;
        } else {
          console.error('Unexpected response format:', response);
          this.toastr.error('Failed to load media data', 'Error', { timeOut: 3000 });
          this.mediaData = [];
        }
      },
      error: (error: any) => {
        console.error('Error fetching media:', error);
        this.toastr.error('Failed to load media data', 'Error', { timeOut: 3000 });
        this.mediaData = [];
      }
    });
  }

  loadArticles(): void {
    this._articleService.getArticles().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success && Array.isArray(response.result)) {
          this.rowData = response.result;
        } else {
          console.error('Unexpected response format:', response);
          this.toastr.error('Failed to load articles', 'Error', { timeOut: 3000 });
          this.rowData = [];
        }
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
        this.toastr.error('Failed to load articles', 'Error', { timeOut: 3000 });
        this.rowData = [];
      }
    });
  }

  // formatFileSize(params: any) {
  //   const bytes = params.value;
  //   if (bytes < 1024) return bytes + ' B';
  //   let kB = bytes / 1024;
  //   if (kB < 1024) return kB.toFixed(2) + ' KB';
  //   let MB = kB / 1024;
  //   return MB.toFixed(2) + ' MB';
  // }

  actionsRenderer(params: any) {
    const viewButton = document.createElement('button');
    viewButton.innerHTML = '<i class="fa fa-eye" aria-hidden="true"></i>';
    const classes = 'btn text-white ms-3 my-3';
    viewButton.classList.add(...classes.split(' '));
    viewButton.classList.add('btn-info');
    viewButton.addEventListener('click', () => params.viewPage(params.data));

    const updateButton = document.createElement('button');
    updateButton.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
    updateButton.classList.add(...classes.split(' '));
    updateButton.classList.add('btn-warning');
    updateButton.addEventListener('click', () => params.updateItem(params.data));

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    deleteButton.classList.add(...classes.split(' '));
    deleteButton.classList.add('btn-danger');
    deleteButton.addEventListener('click', () => params.deleteItem(params.data));

    const container = document.createElement('div');
    container.appendChild(viewButton);
    container.appendChild(updateButton);
    container.appendChild(deleteButton);

    return container;
  }

  viewPage(item: any) {
    console.log('View page for:', item);
    this.router.navigateByUrl(`pages/content/viewPage/${item._id}`);
  }

  updateItem(item: any) {
    console.log('Update item:', item._id);
    this.router.navigateByUrl(`pages/content/createArticle/${item._id}`);
  }

  deleteItem(item: any) {
    console.log('Delete item:', item._id);
    this._articleService.deleteArticle(item._id).subscribe(
      (res: any) => {
        this.toastr.info(`${res.message}`, 'Success !!', {
          timeOut: 3000,
          closeButton: true,
          progressBar: true
        });
        this.loadArticles();
        console.log('Item deleted successfully', res);
      },
      (error) => {
        console.error('Error deleting item', error);
        this.toastr.error('Failed to delete article', 'Error', { timeOut: 3000 });
      }
    );
  }

  viewMediaPage(item: any) {
    console.log('View media page for:', item);
    this.ngZone.run(() => {
      // Perform your action here
      console.log(item.image); // Example action
      // Or if you are navigating, for example
      window.location.href = item.image;
    });
  }

  updateMediaItem(item: any) {
    console.log('Update media item:', item._id);
    this.router.navigate([`pages/media/createMedia/${item._id}`]);
  }

  deleteMediaItem(item: any) {
    console.log('Delete media item:', item._id);
    this._mediaService.deleteMedia(item._id).subscribe(
      (res: any) => {
        this.toastr.info(`${res.message}`, 'Success !!', {
          timeOut: 3000,
          closeButton: true,
          progressBar: true
        });
        this.loadMedia();
        console.log('Media item deleted successfully', res);
      },
      (error) => {
        console.error('Error deleting media item', error);
        this.toastr.error('Failed to delete media item', 'Error', { timeOut: 3000 });
      }
    );
  }
}
