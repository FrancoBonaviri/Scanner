import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];
  constructor(private storage: Storage,
              private navCtrl: NavController,
              private browser: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
    this.cargarStorage();
  }

  async guardarRegistro(format: string, texto: string){
    await this.cargarStorage();
    const nuevoRegistro = new Registro( format, texto );
    this.registros.unshift( nuevoRegistro );


    this.storage.set('registros', this.registros);
    this.abrirRegistro( nuevoRegistro );
  }

  
  
  abrirRegistro(registro: Registro){
    this.navCtrl.navigateForward('/tabs/tab2');
    switch(registro.type){

      case 'http':
        this.browser.create( registro.text, '_system' );
      break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
      break;
    }
        
  }


  enviarCorreo(){
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Fecha de Creación, Texto\n';
    arrTemp.push( titulos );
    this.registros.forEach(registro => {
      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace(',',' ') }\n`;
      arrTemp.push( linea );
    });

    this.crearArchivo(arrTemp.join(''));
  }


  crearArchivo(text: string){
    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
      .then(exist => {
        console.log(exist);
        return this.escribirArchivo( text );
      })
        .catch(err => {
          return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
            .then( creado => this.escribirArchivo( text ))
              .catch(err2 => console.log('Ocurrio un error inesperado', err2));
        })


  }
  async escribirArchivo(text: string){
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text);

    const archivo = `${this.file.dataDirectory}registros.csv`
    console.log(this.file.dataDirectory + 'registros.scv');
    const created = new Date;
    const email = {
      to: '',
      attachments: [
        archivo
      ],
      subject: 'Backup de Scans',
      body: `Este es un Backup de tu historial de Scans - <strong>ScanApp</strong> - ${created.toLocaleString()}`,
      isHtml: true,
    };
    this.emailComposer.open(email);
  }



  async cargarStorage(){
    this.registros = await this.storage.get('registros') || [];
  }
}
