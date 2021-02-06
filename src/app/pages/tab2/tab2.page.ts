import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  slideOpt = {
    allowSlidePrev: false,
    allowSlideNext: false,
  }

  constructor(public dataLocal: DataLocalService,
              private navCtrl: NavController) {}
                         

  enviarCorreo(){
    this.dataLocal.enviarCorreo();
  }

  onClick(){
    this.navCtrl.navigateForward('/tabs/tab1');
  }

  abrirRegistro( registro ){
    this.dataLocal.abrirRegistro( registro );
  }
}
