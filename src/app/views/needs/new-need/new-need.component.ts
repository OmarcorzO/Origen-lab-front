import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Paginator } from '../../interfaces/paginator';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { IndicatorService } from '../services/indicator.service';
import { NewNeedsService } from '../services/new-needs.service';
import { Indicator } from './../../interfaces/indicatorP'
import { Needs } from './../../interfaces/needsP'
import {
  cilList,
  cilShieldAlt,
  cilCheck,
  cilBan,
  cilThumbUp,
  cilThumbDown,
  cilChatBubble,
  cilX,
  cilPencil,
  cilTrash,
  cilSpeedometer
} from '@coreui/icons';

@Component({
  selector: 'app-new-need',
  templateUrl: './new-need.component.html',
  styleUrls: ['./new-need.component.scss']
})
export class NewNeedComponent implements OnInit {
  icons = {
    cilList,
    cilShieldAlt,
    cilCheck,
    cilBan,
    cilThumbUp,
    cilThumbDown,
    cilChatBubble,
    cilX,
    cilPencil,
    cilTrash,
    cilSpeedometer
  };
  private tokensave: string = '';

  // Configuración Array
  paginatorNeed = new Paginator() ;
  paginatorIndi = new Paginator();

  // Forms
  public formCreateNeed!: FormGroup;
  public formEditNeed!: FormGroup;
  public formCreateIndi!: FormGroup;
  public formEditIndi!: FormGroup;
  public formSubmitted: boolean = false;

  public needsArray: Needs[] = [];
  public indiArray: Indicator[] = [];

  public idNeedSave: any = 0;

  // Modal
  public modalView!: BsModalRef;
  public modalCreate!: BsModalRef;
  public modalEdit!: BsModalRef;

  constructor(
    public needService: NewNeedsService,
    public indiService: IndicatorService,
    public swalService: SwalService,
    public fb: FormBuilder,
    public validateService: ValidationMessagesService,
    public modalService: BsModalService,
    public routes: Router
  ) {
    this.buildForms();
  }

  ngOnInit(): void {
    if (localStorage.getItem('TOKEN') !== null) {
      this.tokensave = localStorage.getItem('TOKEN') ?? '';
    }
    this.listNeed();
  }

  buildForms(): void {
    // Necesidades
    this.formCreateNeed = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(5)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      target: ["", [Validators.required, Validators.minLength(5)]],
    })
    this.formEditNeed = this.fb.group({
      idNeed: [""],
      title: ["", [Validators.required, Validators.minLength(5)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      municipality: ["", [Validators.required, Validators.minLength(5)]],
      target: ["", [Validators.required, Validators.minLength(5)]],
    })
    // Indicadores
    this.formCreateIndi = this.fb.group({
      idNeed: ["", [Validators.required]],
      description: ["", [Validators.required, Validators.minLength(5)]],
    })
    this.formEditIndi = this.fb.group({
      idNeedIndicator: [""],
      idNeed: ["", [Validators.required]],
      description: ["", [Validators.required, Validators.minLength(5)]],
    })
    // Paginadores
    this.paginatorNeed.currentPage = 1;
    this.paginatorIndi.currentPage = 1;
    this.paginatorIndi.sizePage = 5;
    this.paginatorNeed.sizePage = 5;
  }

  openModalCreate(template, type): void {
    this.formSubmitted = false;
    this.modalCreate = this.modalService.show(template, {class: 'modal-dialog-centered', backdrop: true});

    if (type === 'need') {
      this.formCreateNeed?.reset();
    } else {
      this.formCreateIndi?.reset();
      this.formCreateIndi?.get('idNeed')?.setValue(this.idNeedSave);
    }
  }

  openModalView(template, idNeed): void {
    this.modalView = this.modalService.show(template, {class: 'modal-dialog-centered', backdrop: true});
    this.idNeedSave = idNeed;
    this.listIndi(this.idNeedSave);
  }

  openModalEdit(template, data, type): void {
    this.formSubmitted = false;
    this.modalEdit = this.modalService.show(template, {class: 'modal-dialog-centered', backdrop: true});

    if (type === 'need') {
      this.formEditNeed?.patchValue({
        idNeed: data._id,
        title: data.title,
        description: data.description,
        target: data.target,
        municipality: data.municipality
      });
    } else {
      this.formEditIndi?.patchValue({
        idNeedIndicator: data._id,
        idNeed: data.idNeed,
        description: data.description,
      });
    }
  }

  createNeed(): void {
    this.formSubmitted = true;
    this.formCreateNeed?.patchValue({
      title: this.formCreateNeed.value.title.trim(),
      description: this.formCreateNeed.value.description.trim(),
      target: this.formCreateNeed.value.target.trim(),
    })

    if (this.formCreateNeed?.invalid) {
      (<HTMLFormElement>document.getElementById('formCreateNeed')).setAttribute('class', 'was-validated')
    } else {
      this.needService.createNeed(this.tokensave, this.formCreateNeed?.value).subscribe(
        (res: any ) => {
          this.listNeed();
          this.swalService.confirmation('Necesidad creada');
          this.modalCreate?.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error)
        }
      )
    }
  }
  
  updateNeed(): void {
    this.formSubmitted = true;
    this.formEditNeed?.patchValue({
      title: this.formEditNeed.value.title.trim(),
      description: this.formEditNeed.value.description.trim(),
      target: this.formEditNeed.value.target.trim(),
      municipality:  this.formEditNeed.value.municipality.trim(),
    })
    
    if (this.formEditNeed?.invalid) {
      (<HTMLFormElement>document.getElementById('formEditNeed')).setAttribute('class', 'was-validated')
    } else {
      this.needService.updateNeed(this.tokensave, this.formEditNeed?.value).subscribe(
        (res: any ) => {
          this.listNeed();
          this.swalService.confirmation('Necesidad actualizada');
          this.modalEdit?.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    }
  } 

  listNeed(): void {
    this.swalService.searching();
    this.needService.listNeed(this.tokensave).subscribe(
      (res: any) => {
        this.swalService.close();
        this.needsArray = res.data.data;
        this.paginatorNeed.totalItems = this.needsArray.length * 10;
      },
      (error: any) => {
        this.swalService.close();
        this.swalService.error('No tiene el rol permitido para acceder aquí:\n Ente Gubernamental');
        localStorage.removeItem('TOKEN');
        this.routes.navigateByUrl('login');
      }
    )
  }

  disableNeed(need): void {
    Swal.fire({
      title: '¿Está seguro de eliminar la necesidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.needService.disableNeed(this.tokensave, need._id).subscribe(
            (res: any) => {
              this.listNeed(); 
            },
            (error: any) => {
              this.swalService.error('Error al eliminar, intente nuevamente');
            }
          )
        }
      }
    );
  }

  createIndi(): void {
    this.formSubmitted = true;
    this.formCreateIndi?.patchValue({
      description: this.formCreateIndi.value.description.trim(),
    })
    if (this.formCreateIndi?.invalid) {
      (<HTMLFormElement>document.getElementById('formCreateIndi')).setAttribute('class', 'was-validated')
    } else {
      this.indiService.createIndi(this.tokensave, this.formCreateIndi?.value).subscribe(
        (res: any ) => {
          this.listIndi(this.idNeedSave);
          this.swalService.confirmation('Indicador creado');
          this.modalCreate?.hide();
        },
        (error) => {
          this.swalService.error('Se ha presentado una falla, intente nuevamente')
        }
      )
    }
  }
  
  updateIndi(): void {
    this.formSubmitted = true;
    this.formEditIndi?.patchValue({
      description: this.formEditIndi.value.description.trim(),
    })
    
    if (this.formEditIndi?.invalid) {
      (<HTMLFormElement>document.getElementById('formEditIndi')).setAttribute('class', 'was-validated')
    } else {
      this.indiService.updateIndi(this.tokensave, this.formEditIndi?.value).subscribe(
        (res: any ) => {
          this.listIndi(this.idNeedSave);
          this.swalService.confirmation('Indicador actualizado');
          this.modalEdit?.hide();
        },
        (error) => {
          this.swalService.error('Se ha presentado una falla, intente nuevamente')
        }
      )
    }
  } 

  listIndi(idNeed): void {
    this.indiService.listIndi(this.tokensave, idNeed).subscribe(
      (res: any) => {
        this.indiArray = res.data.success.data;
        this.paginatorIndi.totalItems = this.indiArray.length * 10;
      },
      (error: any) => {
        this.swalService.error('No tiene el rol permitido para acceder aquí:\n Ente Gubernamental');
      }
    )
  }

  disableIndi(indi): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el indicador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.indiService.disableIndi(this.tokensave, indi).subscribe(
            (res: any) => {
              this.listIndi(indi.idNeed); 
            },
            (error: any) => {
              this.swalService.error('Error al eliminar, intente nuevamente');
            }
          )
        }
      }
    );
  }

  getErrorMessage(field: string, type) {
    if (type === 'need') {
      return this.validateService.getErrorMessage(field, this.formCreateNeed);
    } else {
      return this.validateService.getErrorMessage(field, this.formCreateNeed);
    }
  }

  invalidField(field: string, type: string) {
    if (type === 'need') {
      return this.validateService.invalidField(field, this.formCreateNeed, this.formSubmitted);
    } else {
      return this.validateService.invalidField(field, this.formCreateIndi, this.formSubmitted);
    }
  }

  getErrorMessageE(field: string, type: string) {
    if (type === 'need') {
      return this.validateService.getErrorMessage(field, this.formEditNeed);
    } else {
      return this.validateService.getErrorMessage(field, this.formEditIndi);
    }
  }

  invalidFieldE(field: string, type: string) {
    if (type === 'need') {
      return this.validateService.invalidField(field, this.formEditNeed, this.formSubmitted);
    } else {
      return this.validateService.invalidField(field, this.formEditIndi, this.formSubmitted);
    }
  }

}
