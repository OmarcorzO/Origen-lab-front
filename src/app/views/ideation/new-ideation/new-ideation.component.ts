import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Paginator } from '../../interfaces/paginator';
import { ProcessIdeaService } from '../../services/process-idea.service';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { IdeationService } from '../services/ideation.service';
import {
  cilBookmark,
  cilInfo,
  cilArrowThickToRight,
  cilSearch,
  cilX,
  cilPlus,
  cilLoopCircular,
  cilPencil,
  cilMagnifyingGlass,
  cilViewStream,
} from '@coreui/icons';

@Component({
  selector: 'app-new-ideation',
  templateUrl: './new-ideation.component.html',
  styleUrls: ['./new-ideation.component.scss']
})
export class NewIdeationComponent implements OnInit {
  icons = {
    cilBookmark, cilInfo, cilArrowThickToRight, cilSearch, cilX, cilPlus,
    cilLoopCircular, cilPencil, cilViewStream, cilMagnifyingGlass
  }

  public tokensave: string = '';
  public selected: boolean = false;
  public userIdG: string = '';
  public ideaIdG: string = '';
  public processData: any = [];
  public extraData: any;

  // Array
  public teamArray: any[] = [];
  public contributionCooArray: any[] = [];
  public contributionTeamArray: any[] = [];

  // Paginadores
  public paginatorMyTeam = new Paginator;
  public paginatorCoo = new Paginator;
  public paginatorTeam = new Paginator;
  
  // Forms
  public descForm!: FormGroup;
  public linkMeetForm!: FormGroup;
  public teamContriForm!: FormGroup;

  // ControlForms
  public formSubmittedD = false;
  public formSubmittedL = false;
  public formSubmittedT = false;

  // Control
  public existLink: boolean = false;
  public existDesc: boolean = false;

  // Modals
  public modal!: BsModalRef;

  constructor(
    private ideationService: IdeationService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private validateService: ValidationMessagesService,
    private modalService: BsModalService,
    public processService: ProcessIdeaService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('TOKEN') !== null) {
      this.tokensave = localStorage.getItem('TOKEN') ?? '';
    }
    this.buildForms();
    this.getMyTeams();
  }

  buildForms(): void {
    this.descForm = this.fb.group({
      ideaId: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      descriptionId: [''],
    })

    this.linkMeetForm = this.fb.group({
      ideaId: ['', [Validators.required]],
      link: ['', [Validators.required, Validators.minLength(10)]],
      meetingLinkId: [''],
    })

    this.teamContriForm = this.fb.group({
      ideaId: ['', [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      contributionId: [''],
    })

    this.paginatorMyTeam.currentPage = 1;
    this.paginatorMyTeam.sizePage = 5;
    this.paginatorCoo.currentPage = 1;
    this.paginatorCoo.sizePage = 5;
    this.paginatorTeam.currentPage = 1;
    this.paginatorTeam.sizePage = 5;
  }

  getMyTeams(): void {
    this.swalService.searching();
    this.ideationService.listStatusTeamsUser(this.tokensave).subscribe(
      (res: any) => {
        this.teamArray = res.data.data;
        this.teamArray = this.teamArray.filter((m: any) => m.ideaId.phase == 'ideation');
        this.swalService.close();
        if (this.teamArray.length !== 0) {
          this.userIdG = this.teamArray[0].userId;
        }
        this.paginatorMyTeam.totalItems = this.teamArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  searchData(id): void {
    this.selected = true;
    this.ideaIdG = id;
    this.formSubmittedD = false;
    this.formSubmittedL = false;
    this.formSubmittedT = false;
    this.swalService.searching();

    this.ideationService.getDescription(this.tokensave, id).subscribe(
      (res: any) => {
        if (res.data.success === 'No existe la descripción') {
          this.existDesc = false;
          this.descForm.reset();
        } else {
          this.swalService.close();
          this.descForm.patchValue({
            description: res.data.data.description,
            descriptionId: res.data.data._id,
          });
          this.existDesc = true;
        }
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )

    this.ideationService.getTeamMeeting(this.tokensave, id).subscribe(
      (res: any) => {
        this.swalService.close();
        if (res.data.success === 'No existe el enlace para la reunion') {
          this.existLink = false;
          this.linkMeetForm.reset();
        } else {
          this.linkMeetForm.patchValue({
            link: res.data.data.link,
            meetingLinkId: res.data.data._id,
          });
          this.existLink = true;
          this.swalService.close();
        }
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )

    this.getContribution(id);

    this.getTeamContibution(id);
  }

  getContribution(id): void {
    this.ideationService.getContributionsOfIdea(this.tokensave, id).subscribe(
      (res: any) => {
        this.contributionCooArray = res.data.data;
        this.paginatorCoo.totalItems = this.contributionCooArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  getTeamContibution(id): void {
    this.ideationService.getTeamsContributions(this.tokensave, id).subscribe(
      (res: any) => {
        this.contributionTeamArray = res.data.data;
        this.paginatorTeam.totalItems = this.contributionTeamArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  changePhase(idIdea): void {
    Swal.fire({
      title: '¿Quiere realizar el cambio de fase?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.ideationService.changePhaseDesignPrototype(this.tokensave, idIdea).subscribe(
            (res: any) => {
              this.swalService.confirmation('La idea ha cambiado de fase');
              this.getMyTeams();
              this.selected = false;
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          ) 
        }
      }
    );
  }

  create(type: string): void {
    if(type == 'link') {
      this.formSubmittedL = true;
      this.linkMeetForm.patchValue({
        ideaId: this.ideaIdG,
        link: this.linkMeetForm.value.link.trim(),
      })
      delete this.linkMeetForm.value.meetingLinkId;
      if (!this.linkMeetForm.invalid) {
        this.swalService.loadingWithText("Cargando", 1000);
        this.ideationService.createTeamMeeting(this.tokensave, this.linkMeetForm.value).subscribe(
          (res: any) => {
            this.swalService.confirmation('Link agregado correctamente');
            this.existLink = true;
            this.linkMeetForm.addControl('meetingLinkId', this.fb.control(''));
          },
          (error) => {            
            this.swalService.error(error.error.data.error);
          }
        )
      } else {
        (<HTMLFormElement>document.getElementById('linkMeetForm')).setAttribute('class', 'was-validated')
        this.swalService.error('Valide la información suministrada')
      }
    } 
    
    else if (type == 'desc') {
      this.formSubmittedD = true;
      this.descForm.patchValue({
        ideaId: this.ideaIdG,
        description: this.descForm.value.description.trim(),
      })
      delete this.descForm.value.descriptionId;
      if (!this.descForm.invalid) {
        this.swalService.loadingWithText("Cargando", 1000);
        this.ideationService.createDescription(this.tokensave, this.descForm.value).subscribe(
          (res: any) => {
            this.swalService.confirmation('Descripción agregada correctamente');
            this.existDesc = true;
            this.descForm.addControl('descriptionId', this.fb.control(''));
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        )
      } else {
        (<HTMLFormElement>document.getElementById('descForm')).setAttribute('class', 'was-validated')
        this.swalService.error('Valide la información suministrada')
      }
    }
  }

  update(type: string): void {
    if(type == 'link') {
      this.formSubmittedL = true;
      this.linkMeetForm.patchValue({
        ideaId: this.ideaIdG,
        link: this.linkMeetForm.value.link.trim(),
      })
      if (!this.linkMeetForm.invalid) {
        this.swalService.loadingWithText("Cargando", 1000);
        this.ideationService.updateTeamMeeting(this.tokensave, this.linkMeetForm.value).subscribe(
          (res: any) => {
            this.swalService.confirmation('Link editado correctamente');
            this.formSubmittedL = false;
            this.existLink = true;
          },
          (error) => {            
            this.swalService.error(error.error.data.error);
          }
        )
      } else {
        (<HTMLFormElement>document.getElementById('linkMeetForm')).setAttribute('class', 'was-validated')
        this.swalService.error('Valide la información suministrada')
      }
    } 
    
    else if (type == 'desc') {
      this.formSubmittedD = true;
      this.descForm.patchValue({
        ideaId: this.ideaIdG,
        description: this.descForm.value.description.trim(),
      })
      if (!this.descForm.invalid) {
        this.swalService.loadingWithText("Cargando", 1000);
        this.ideationService.updateDescription(this.tokensave, this.descForm.value).subscribe(
          (res: any) => {
            this.swalService.confirmation('Descripción editada correctamente');
            this.formSubmittedD = false;
            this.existDesc = true;
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        )
      } else {
        (<HTMLFormElement>document.getElementById('descForm')).setAttribute('class', 'was-validated')
        this.swalService.error('Valide la información suministrada')
      }
    }
  }

  createContribution(): void {
    this.formSubmittedT = true;
    this.teamContriForm?.get('ideaId')?.setValue(this.ideaIdG);
    this.teamContriForm.patchValue({
      comment: this.teamContriForm.value.comment.trim(),
    })
    if (!this.teamContriForm.invalid) {
      this.ideationService.createTeamContribution(this.tokensave, this.teamContriForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation('Aporte creado');
          this.teamContriForm.addControl('contributionId', this.fb.control(''))
          this.getTeamContibution(this.ideaIdG);
          this.modal.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    } else {
      this.swalService.error('Verifique la información suministrada');
    }
  }

  updateContribution(): void {
    this.formSubmittedT = true;
    this.teamContriForm.patchValue({
      comment: this.teamContriForm.value.comment.trim(),
    })
    if (!this.teamContriForm.invalid) {
      this.ideationService.updateTeamContribution(this.tokensave, this.teamContriForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation('Aporte actualizado');
          this.getTeamContibution(this.ideaIdG);
          this.modal.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    } else {
      this.swalService.error('Verifique la información suministrada');
    }
  }

  openModal(template, type: string, data): void {
    this.teamContriForm.reset();
    this.extraData = [];
    this.formSubmittedT = false;

    if (type == 'create') {
      this.teamContriForm.removeControl('contributionId');
      this.modal = this.modalService.show(template, {class: 'modal-dialog-centered'});
    } else if (type == 'edit') {
      this.teamContriForm.patchValue({
        ideaId: data.ideaId,
        comment: data.comment,
        contributionId: data._id,
      })
      this.modal = this.modalService.show(template, {class: 'modal-dialog-centered'});
    } else {
      this.teamContriForm.patchValue({
        comment: data.comment,
      })
      this.extraData.push(data.userId.profile.name + ' ' + data.userId.profile.lastname);
      this.extraData.push(data.userId.email);
      if (data.commentTypeId !== undefined) {
        this.extraData.push(data.commentTypeId.name);
      }
      this.modal = this.modalService.show(template, {class: 'modal-dialog-centered'});
    }
  }

  // *Sección de validaciones*
  getErrorMessage(field: string, type: string): string {
    let res: string = '';
    if (type == 'meet') {
      if (this.linkMeetForm.get(field)!.hasError("pattern")) {
        res = 'La URL compartida no es válida'
      } else {
        res = this.validateService.getErrorMessage(field, this.linkMeetForm)
      }
    } else if (type == 'desc') {
      res = this.validateService.getErrorMessage(field, this.descForm)
    } else if (type == 'teamC') {
      res = this.validateService.getErrorMessage(field, this.teamContriForm)
    }
    return res
  }

  // Validador de campos
  invalidField(field: string, type: string): boolean {
    let res: boolean = false;
    if (type == 'meet') {
      res = this.validateService.invalidField(field, this.linkMeetForm, this.formSubmittedL)
    } else if (type == 'desc') {
      res = this.validateService.invalidField(field, this.descForm, this.formSubmittedD)
    } else if (type == 'teamC') {
      res = this.validateService.invalidField(field, this.teamContriForm, this.formSubmittedT)
    }
    return res
  }

  processIdea(id, type, template) {
    this.processService.getProcessIdea(this.tokensave, id).subscribe(
      (res: any) => {
        this.processData = res.data.data[0];
        var message = ''
        if (type === 0) {
          this.modal = this.modalService.show(template, {class: 'modal-dialog-centered'})
          // if (this.processData.regionNeeds.length === 0) {
          //   message = 'No se encontraron necesidades para la región';
          // } else {
          //   message = 'Las necesidades que se asociaron a la idea son: ';
          //   this.processData.regionNeeds.forEach(
          //     (element) => {
          //       message += '<br><b>Título:</b> ' + element.needs.title + '<br><b>Desc:</b> ' + element.needs.description + '<br><b>Municipio:</b> ' + element.needs.municipality + '<br>';
          //     }
          //   );
          // }
        } else if (type === 1) {
          if (this.processData.teammeetinglinks.length === 0) {
            message = 'Últimamente no se ha creado link para reuniones';
          } else {
            const data = this.processData.teammeetinglinks[0];
            message = 'Creado por: ';
            message += data.userteammeetinglinks.profile.name + ' ' + data.userteammeetinglinks.profile.lastname + ' el día <b>' + data.createdAt.split('T')[0] + '</b><br>';
            if (data.updateByTeammeetinglinks !== undefined) {
              message += 'Actualizado por: ' + data.updateByTeammeetinglinks.profile.name + ' ' + data.updateByTeammeetinglinks.profile.lastname + ' el día <b>' + data.updatedAt.split('T')[0] +'</b>';
            }
          }
          Swal.fire({
            title: 'Información',
            html: `${message}`,
            icon: 'info',
            confirmButtonColor: '#3e8457',
          })
        } else if (type === 2) {
          if (this.processData.teamdescriptions.length === 0) {
            message = 'Últimamente no se ha detallado una descripción del proyecto';
          } else {
            const data = this.processData.teamdescriptions[0];
            message = 'Redactado por: ';
            message += data.userteamdescription.profile.name + ' ' + data.userteamdescription.profile.lastname + ' el día <b>' + data.createdAt.split('T')[0] + '</b><br>';
            if (data.updateByteamdescription !== undefined) {
              message += 'Actualizado por: ' + data.updateByteamdescription.profile.name + ' ' + data.updateByteamdescription.profile.lastname + ' el día <b>' + data.updatedAt.split('T')[0] +'</b>';
            }
          }
          Swal.fire({
            title: 'Información',
            html: `${message}`,
            icon: 'info',
            confirmButtonColor: '#3e8457',
          })
        }
      },
      (error) => {
        this.swalService.error(error.error.data.error);
        console.log(error);
      }
    )
  }

  searchUrl() {
    window.open(this.linkMeetForm?.get('link')?.value, '_blank');
  }

}
