import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContentService } from 'src/app/core/services/content.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private _articleService : ContentService, private toastr : ToastrService, private router : Router){
    
  }

  rowData: any[] = [];
  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', flex: 2},
    { field: 'author', headerName: 'Author', flex : 1},
    {
      headerName: 'Actions',
      cellRenderer: this.actionsRenderer,
      cellRendererParams: {
        viewPage: this.viewPage.bind(this),
        updateItem: this.updateItem.bind(this),
        deleteItem: this.deleteItem.bind(this)
      },
      autoHeight : true,
      flex: 3
    }
  ];
  
 
  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this._articleService.getArticles().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success && Array.isArray(response.result)) {
          this.rowData = response.result;
        } else {
          console.error('Unexpected response format:', response);
          this.rowData = [];
        }
      },
      error: (error) => {
        console.error('Error fetching articles:', error);
        this.rowData = [];
      }
    });
  }


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
    this.router.navigateByUrl(`pages/content/viewPage/${item._id}`)
    // Implement view page logic
  }

  updateItem(item: any) {
    console.log('Update item:', item._id);
    this.router.navigateByUrl(`pages/content/createArticle/${item._id}`)
    // Implement update logic
  }

  deleteItem(item: any) {
    console.log('Delete item:', item._id);
    
    this._articleService.deleteArticle(item._id).subscribe(
      (res: any) => {
        this.toastr.info(`${res.message}`,'Success !!',{
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        })
        this.loadArticles()
        console.log('Item deleted successfully', res);
        // Update your UI or notify the user as needed
      },
      error => {
        console.error('Error deleting item', error);
        // Handle the error, maybe notify the user
      }
    );
  }
}
