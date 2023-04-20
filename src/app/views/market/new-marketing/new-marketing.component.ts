import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { MarketService } from '../services/market.service'
import { ProcessIdeaService } from '../../services/process-idea.service'
import { Paginator } from '../../interfaces/paginator'

@Component({
  selector: 'app-new-marketing',
  templateUrl: './new-marketing.component.html',
  styleUrls: ['./new-marketing.component.scss']
})
export class NewMarketingComponent {
  public tokensave = '';
  public ideaIdG: string = '';
  public marketIdG: string = '';
  public rolIdG: string = '';
  public processData: any = [];

  public existMarket: boolean = false;
  public selected: boolean = false;

  // Arrays
  public teamArray: any[] = [];
  public marketChallArray: any[] = [];

  // Forms
  public marketForm!: FormGroup;
  public marketChallForm!: FormGroup;
  public evidenceForm!: FormGroup;

  // Paginator
  public pagMyTeam = new Paginator;
  public pagMarketChall = new Paginator;

  public formSubmittedM: boolean = false;
  public formSubmittedC: boolean = false;

  public modal!: BsModalRef;
  public sizeEvidence: boolean = false;
  
  constructor(
    private marketService: MarketService,
    private swalService: SwalService,
    private fb: FormBuilder,
    public validateService: ValidationMessagesService,
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

  buildForms() {
    this.marketForm = this.fb.group({
      country: ['', [Validators.required, Validators.minLength(5)]],
      department: ['', [Validators.required, Validators.minLength(5)]],
      city: ['probando ando los valores', [Validators.required, Validators.minLength(5)]],
      zone: ['', [Validators.required, Validators.minLength(5)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      population: ['', [Validators.required, Validators.minLength(5)]],
      ideaId: ['', [Validators.required]],
    })

    this.marketChallForm = this.fb.group({
      title:  ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(7)]],
      finishDate: ['', [Validators.required]],
      marketId: [''],
      marketChallengeId: [''],
      ideaId: ['', [Validators.required]]
    })

    this.evidenceForm = this.fb.group({
      ideaId: ['', [Validators.required]],
      marketChallengeId: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
    })

    this.pagMyTeam.currentPage = 1;
    this.pagMyTeam.sizePage = 5;
    this.pagMarketChall.currentPage = 1;
    this.pagMarketChall.sizePage = 5;
  }

  getMyTeams(): void {
    this.swalService.searching();
    this.marketService.listStatusTeamsUser(this.tokensave).subscribe(
      (res: any) => {
        this.swalService.close();
        this.teamArray = res.data.data;
        this.teamArray = this.teamArray.filter((m: any) => m.ideaId.phase == 'marketing' || m.ideaId.phase == 'finalized');
        this.pagMyTeam.totalItems = this.teamArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  searchData(id, rolUser): void {
    this.ideaIdG = id;
    this.formSubmittedM = false;
    this.selected = false;

    this.marketForm?.reset({country: '', address: '', city: '', department: '',  population: '', zone: ''});
    this.swalService.searching();
    this.rolIdG = rolUser;
    this.getMarket(id, 0);
    
  }

  getMarket(id, swal) {
    this.marketService.getMarket(this.tokensave, id).subscribe(
      (res: any)=> {
        this.selected = true;
        if (swal === 0) {
          this.swalService.close();
        }
        if (res.data.success !== 'El mercado objetivo no ha sido creado') {
          const market = res.data.data;
          this.marketForm?.patchValue({
            address: market.address,
            city: market.city,
            country: market.country,
            department: market.department,
            ideaId: market.ideaId._id,
            population: market.population,
            zone: market.zone,
          })
          this.marketIdG = market._id;
          this.existMarket = true;
          this.getMarketChall(this.ideaIdG, this.marketIdG);
        } else {
          this.existMarket = false;
        }
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  getMarketChall(id, marketId) {
    this.marketService.getMarketChallenge(this.tokensave, id, marketId).subscribe(
      (res: any) => {
        this.marketChallArray = res.data.data;
        this.pagMarketChall.totalItems = this.marketChallArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  openModal(template, type, data?) {
    this.formSubmittedC = false;
    if (type === 'create') {
      this.marketChallForm?.reset();
    } else if (type === 'edit') {
      this.marketChallForm?.patchValue({
        title: data.title,
        description: data.description,
        finishDate: data.finishDate.split('T')[0],
        marketChallengeId: data._id,
        ideaId: data.marketId.ideaId,
      })
    } else if (type === 'evidence') {
      this.evidenceForm?.patchValue({
        ideaId: data.marketId.ideaId,
        marketChallengeId: data._id,
        evidence: data.evidenceLink,
      })
      if (data.evidenceLink !== '') {
        this.sizeEvidence = true;
      } else {
        this.sizeEvidence = false;
      }
    }
    this.modal = this.modalService.show(template, {class: 'modal-dialog-centered'})
  }

  createMarket() {
    this.formSubmittedM = true;
    this.marketForm?.get('ideaId')?.setValue(this.ideaIdG);
    this.marketForm?.patchValue({
      address: this.marketForm.value.address.trim(),
      city: this.marketForm.value.city.trim(),
      country: this.marketForm.value.country.trim(),
      department: this.marketForm.value.department.trim(),
      population: this.marketForm.value.population.trim(),
      zone: this.marketForm.value.zone.trim(),
    })
    if (this.marketForm?.valid) {
      delete this.marketForm.value.marketId;
      this.marketService.createMarket(this.tokensave, this.marketForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation('Mercado Creado');
          this.getMarket(this.ideaIdG, 1);
          this.formSubmittedM = false;
        },
        (error) => {
          this.swalService.error(error.error.data.error);
          this.getMarket(this.ideaIdG, 1);
        }
      )
    } else {
      (<HTMLFormElement>document.getElementById('marketForm')).setAttribute('class', 'was-validated')
    }
  }

  updateMarket() {
    this.formSubmittedM = true;
    this.marketForm?.patchValue({
      address: this.marketForm.value.address.trim(),
      city: this.marketForm.value.city.trim(),
      country: this.marketForm.value.country.trim(),
      department: this.marketForm.value.department.trim(),
      population: this.marketForm.value.population.trim(),
      zone: this.marketForm.value.zone.trim(),
    })
    if (this.marketForm?.valid) {
      this.marketService.updateMarket(this.tokensave, this.marketForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation('Mercado Actualizado');
          this.getMarket(this.ideaIdG, 1);
          this.formSubmittedM = false;
        },
        (error) => {
          if (error.error.data.error.includes('puede crear')) {
            this.swalService.error('Solo el administrador puede actualizar el mercado');
          } else {
            this.swalService.error(error.error.data.error)
          }
          this.getMarket(this.ideaIdG, 1);
        }
      )
    } else {
      (<HTMLFormElement>document.getElementById('marketForm')).setAttribute('class', 'was-validated')
    }
  }

  createMarketChallenge() {
    this.formSubmittedC = true;
    this.marketChallForm?.patchValue({
      ideaId: this.ideaIdG,
      marketId: this.marketIdG,
      title: this.marketChallForm.value.title.trim(),
      description: this.marketChallForm.value.description.trim(),
    })
    if (this.marketChallForm?.valid) {
      delete this.marketChallForm.value.marketChallengeId;
      this.marketService.createMarketChallenge(this.tokensave, this.marketChallForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation('Reto de mercado creado');
          this.marketChallForm?.addControl('marketChallengeId', this.fb.control([]));
          this.getMarketChall(this.ideaIdG, this.marketIdG);
          this.modal?.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error)
        }
      )
    } else {
      (<HTMLFormElement>document.getElementById('marketChallForm')).setAttribute('class', 'was-validated')
    }
  }

  updateMarketChallenge() {
    this.formSubmittedC = true;
    this.marketChallForm?.patchValue({
      title: this.marketChallForm.value.title.trim(),
      description: this.marketChallForm.value.description.trim(),
    })
    if (this.marketChallForm?.valid) {
      delete this.marketChallForm.value.marketId;
      this.marketService.updateMarketChallange(this.tokensave, this.marketChallForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation('Reto de mercado actualizado');
          this.marketChallForm?.addControl('marketId', this.fb.control([]));
          this.getMarketChall(this.ideaIdG, this.marketIdG);
          this.modal?.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error)
        }
      )
    } else {
      (<HTMLFormElement>document.getElementById('marketChallForm')).setAttribute('class', 'was-validated')
      
    }
  } 

  endMarketC(id) {
    Swal.fire({
      title: '¿Cómo finalizó el reto del mercado?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Correctamente',
      confirmButtonColor: '#3e8457',
      denyButtonText: 'Con fallos',
      cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const object = {
            ideaId: this.ideaIdG,
            marketChallengeId: id,
            type: 'success',
          }
          this.marketService.finalizedMarketChallange(this.tokensave, object).subscribe(
            (res: any) => {
              this.swalService.confirmation('Reto de mercado finalizado');
              this.getMarket(this.ideaIdG, 1);
            },
            (error) => {
              this.swalService.error(error.error.data.error)
            }
          )
        } else if (result.isDenied) {
          const object = {
            ideaId: this.ideaIdG,
            marketChallengeId: id,
            type: 'failed',
          }
          this.marketService.finalizedMarketChallange(this.tokensave, object).subscribe(
            (res: any) => {
              this.swalService.confirmation('Reto de mercado finalizado');
              this.getMarket(this.ideaIdG, 1);
            },
            (error) => {
              this.swalService.error(error.error.data.error)
            }
          )
        }
      }
    )
  }

  disableMarketC(id) {
    Swal.fire({
      title: '¿Está seguro de eliminar el reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          const object = {
            ideaId: this.ideaIdG,
            marketChallengeId: id,
          }
          this.marketService.disableMarketChallange(this.tokensave, object).subscribe(
            (res: any) => {
              this.swalService.confirmation('Reto de mercado eliminado exitosamente');
              this.getMarket(this.ideaIdG, 1);
            },
            (error) => {
              this.swalService.error(error.error.data.error)
            }
          )
        }
      }
    )
  }

  finalizedIdea(id) {
    this.marketIdG = '';
    Swal.fire({
      title: '¿Se han cumplido los requerimientos correctamente de la idea?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si, correcto',
      confirmButtonColor: '#3e8457',
      denyButtonText: 'No, con fallos',
      cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.marketService.getMarket(this.tokensave, id).subscribe(
            (res: any)=> {
              if (res.data.success !== 'El mercado objetivo no ha sido creado') {
                const market = res.data.data;
                this.marketIdG = market._id;

                const object = {
                  ideaId: id,
                  marketId: this.marketIdG,
                  finalized: 'success',
                }
                this.marketService.finalizedIdea(this.tokensave, object).subscribe(
                  (res) => {
                    this.swalService.confirmation('Proceso de la idea finalizado');
                    this.getMyTeams();
                  },
                  (error) => {
                    this.swalService.error(error.error.data.error);
                  }
                )
              } else {
                this.swalService.error('No puede finalizar sin tener un mercado establecido')
              } 
            },
            (error) => {
              this.swalService.checkError(error.status);
            }
          )   
        } else if (result.isDenied) {
          this.marketService.getMarket(this.tokensave, id).subscribe(
            (res: any)=> {
              if (res.data.success !== 'El mercado objetivo no ha sido creado') {
                const market = res.data.data;
                this.marketIdG = market._id;

                const object = {
                  ideaId: id,
                  marketId: this.marketIdG,
                  finalized: 'failed',
                }
                this.marketService.finalizedIdea(this.tokensave, object).subscribe(
                  (res) => {
                    this.swalService.confirmation('Proceso de la idea finalizado');
                    this.getMyTeams();
                  },
                  (error) => {
                    this.swalService.error(error.error.data.error);
                  }
                )
              } else {
                this.swalService.error('No puede finalizar sin tener un mercado establecido')
              } 
            },
            (error) => {
              this.swalService.checkError(error.status);
            }
          )
        }
      }
    )
  }

  uploadEvidence() {
    if (this.evidenceForm?.valid) {
      this.marketService.updateEvidenceMarketChallenge(this.tokensave, this.evidenceForm.value).subscribe(
        (res: any) => {
          this.swalService.confirmation(res.data.success);
          this.getMarket(this.ideaIdG, 1)
          this.modal?.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    } else {
      this.swalService.error('Debe escoger la evidencia');
    }
  }

  deleteEvidence() {
    Swal.fire({
      title: '¿Desea eliminar la evidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.evidenceForm?.valid) {
            const object = {
              ideaId: this.ideaIdG,
              marketChallengeId: this.evidenceForm.value.marketChallengeId,
            }
            this.marketService.deleteEvidenceMarketChallenge(this.tokensave, object).subscribe(
              (res: any) => {
                this.swalService.confirmation(res.data.success);
                this.getMarket(this.ideaIdG, 1)
                this.modal?.hide();
              },
              (error) => {
                this.swalService.error(error.error.data.error);
              }
            )
          } else {
            this.swalService.error('Error en la eliminación de la evidencia');
          }
        }
      }
    )
    
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let data = file.name.split('.');
      if (data[data.length-1].toLowerCase() === 'png' || data[data.length-1].toLowerCase() === 'pdf' || data[data.length-1].toLowerCase() === 'jpg') {
        this.evidenceForm?.get("evidence")?.setValue(file);
      } else {
        this.swalService.error('Solo se permiten archivos: pdf o imagen')
      }
    } else {
      this.evidenceForm?.patchValue({
        evidence: '',
      });
      this.sizeEvidence = false;
    }
  }

  // *Sección de validaciones*
  getErrorMessage(field: string, type: string): string {
    if (type == 'market') {
      return this.validateService.getErrorMessage(field, this.marketForm)
    } 
    return this.validateService.getErrorMessage(field, this.marketChallForm)
    
  }

  // Validador de campos
  invalidField(field: string, type: string): boolean {
    if (type == 'market') {
      return this.validateService.invalidField(field, this.marketForm, this.formSubmittedM)
    } 
    return this.validateService.invalidField(field, this.marketChallForm, this.formSubmittedC)
  }

  processIdea(id, type) {
    this.processService.getProcessIdea(this.tokensave, id).subscribe(
      (res: any) => {
        this.processData = res.data.data[0];
        var message = '';
        if (type === 'finalized') {
          const fin = this.processData.finalizedideas
          if (fin.length !== 0) {
            if (fin[0].finalized === 'failed') {
              // userfinalizedideas
              message = 'Se consideró que el proyecto se finalizó de forma <b style="color: red"> errónea </b> por el usuario:' 
              + '<br>' + fin[0].userfinalizedideas.profile.name + ' ' + fin[0].userfinalizedideas.profile.lastname
              + '<br> El día <b>' + fin[0].createdAt.split('T')[0] + '</b>';
            } else if (fin[0].finalized === 'success') {
              message = 'Se consideró que el proyecto se finalizó de forma <b style="color: green"> correcta </b> por el usuario:' 
              + '<br>' + fin[0].userfinalizedideas.profile.name + ' ' + fin[0].userfinalizedideas.profile.lastname
              + '<br> El día <b>' + fin[0].createdAt.split('T')[0] + '</b>';
            }
          } else {
            message = 'Ocurrieron problemas al finalizar la idea';
          }
        } else if (type === 'marketing') {
          const market = this.processData.markets;
          if (market.length !== 0) {
            message = 'El mercado se creó el día <b>' + market[0].createdAt.split('T')[0] + '</b>'
            + '<br> Última actualización: <b>' + market[0].updatedAt.split('T')[0] + '</b>';
          } else {
            message = 'No se tiene un mercado establecido todavía';
          }
        }
        Swal.fire({
          title: 'Información',
          html: `${message}`,
          icon: 'info',
          confirmButtonColor: '#3e8457',
        })
      },
      (error) => {
        this.swalService.error(error.error.data.error);
        console.log(error);
      }
    )
  }
}

