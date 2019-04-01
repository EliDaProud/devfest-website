import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Partner } from '../dto/partner';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialIconsService } from '../shared/social-icons.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private partnersCollection: AngularFirestoreCollection<Partner>;
  partners: Observable<Partner[]>;
  showTickets = environment.tickets;

  constructor(private afStore: AngularFirestore, private socialsSer: SocialIconsService) { }

  ngOnInit() {
    this.partnersCollection = this.afStore.collection<Partner>('partners', ref => ref.where('top', '==', true).orderBy('order'));
    this.partners = this.partnersCollection.valueChanges();
  }

}
