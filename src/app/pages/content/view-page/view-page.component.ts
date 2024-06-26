import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/core/services/content.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent {
  constructor(private _articleService : ContentService, private toastr : ToastrService, private route : ActivatedRoute){
    
  }
  article!: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._articleService.getArticle(id).subscribe(
        (data : any) => {
          console.log(data)
          this.article = data.result}
          ,
        (error : any) => console.error('Error fetching article', error)
      );
    }
  }
}
  