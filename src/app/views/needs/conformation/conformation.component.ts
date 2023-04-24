import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { Paginator } from '../../interfaces/paginator';
import { ProfileUser } from '../../interfaces/profileUser';
import { ProcessIdeaService } from '../../services/process-idea.service';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { ConformationService } from '../services/conformation.service';
import { NewNeedsService } from '../services/new-needs.service';
import { Needs } from '../../interfaces/needsP';

@Component({
  selector: 'app-conformation',
  templateUrl: './conformation.component.html',
  styleUrls: ['./conformation.component.scss']
})
export class ConformationComponent implements OnInit {
  private tokensave: string = '';
  private idTemp: string = '';
  private processData: any = [];

  // profileUser
  private profileUser: ProfileUser = {
    administrator: false,
  };

  // Forms
  public formTeam!: FormGroup;

  // Arrays
  public ideasTBArray: any[] = [];
  public teamUserArray: any[] = [];
  public needsArray: Needs[] = [];
  public rolList: any[] = [];
  public needsArrayTeam: { idIdea: string, idNeed: string,}[] = [];

  // Paginadores
  public paginatorTeam = new Paginator();
  public paginatorTeamUser = new Paginator();
  public paginatorNeedsUser = new Paginator();

  // Modals
  public modalView: string = '';
  public modalAddUser!: BsModalRef;

  constructor(
    public conformationService: ConformationService,
    public swalService: SwalService,
    public fb: FormBuilder,
    public validateService: ValidationMessagesService,
    public needService: NewNeedsService,
    public authService: AuthService,
    public modalService: BsModalService,
    public routes: Router,
    public processService: ProcessIdeaService
  ) {
    this.buildForms();
  }

  ngOnInit(): void {
    if (localStorage.getItem('TOKEN') !== null) {
      this.tokensave = localStorage.getItem('TOKEN') ?? '';
    }
    this.initUser();
    this.getUserTeams();
    this.listIdeasTeam();
  }

  buildForms(): void {
    // Equipo
    this.formTeam = this.fb.group({
      ideaId: ["", [Validators.required]]
    })
    
    // Paginadores
    this.paginatorTeam.currentPage = 1;
    this.paginatorTeam.sizePage = 5;
    this.paginatorTeamUser.currentPage = 1;
    this.paginatorTeamUser.sizePage = 5;
  }

  initUser(): void {
    this.authService.getProfile(this.tokensave).subscribe(
      (res: any) =>  {
        this.profileUser = res.data.profile;

        this.authService.rolList(this.tokensave).subscribe(
          (res: any) => {
            this.rolList = res.data.value;
            const rol = this.rolList.find((m) => m._id == this.profileUser.rol);
            this.profileUser.rol = rol.code;

            if (this.profileUser.rol == 'userGovernmentEntity') {
              this.needService.listNeed(this.tokensave).subscribe(
                (res: any) => {
                  this.needsArray = res.data.data;
                  this.paginatorNeedsUser.totalItems = this.needsArray.length * 10;
                },
                (error) => {
                  this.swalService.checkError(error.status);
                }
              )
            } 
          },
          (error) => {
            this.swalService.checkError(error.status)
          }
        )
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  getUserTeams(): void {
    this.conformationService.listStatusTeamsUser(this.tokensave).subscribe(
      (res: any) =>  {
        this.teamUserArray = res.data.data; 
        this.paginatorTeamUser.totalItems = this.teamUserArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  listIdeasTeam(): void {
    this.conformationService.listIdeaPhase(this.tokensave).subscribe(
      (res: any) =>  {
        this.ideasTBArray = res.data.value;
        this.paginatorTeam.totalItems = this.ideasTBArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    )
  }

  addTeam(template, id): void {
    if (this.profileUser.rol == 'userGovernmentEntity') {
      this.modalView = 'gober';
      this.idTemp = id;
      this.needsArrayTeam = [];
      this.modalAddUser = this.modalService.show(template, {class: 'modal-dialog-centered'});
    } else if (this.profileUser.rol == 'userBusinessUnit'){
      this.swalService.error('No tiene el rol para formar parte de un equipo')
    } 
    if (this.profileUser.rol != 'userBusinessUnit' && this.profileUser.rol != 'userGovernmentEntity' && this.profileUser.administrator) {
        Swal.fire({
        title: '¿Quieres formar parte del grupo como administrador?',
        text: "Tenga en cuenta que solo habrá uno",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, postularme',
        confirmButtonColor: '#3e8457',
        cancelButtonText: 'No, gracias',
        }).then((result) => {
          if (result.isConfirmed) {
            this.formTeam?.get('ideaId')?.setValue(id);
            this.formTeam?.addControl('administrator', this.fb.control(true))
            this.swalService.loading(1000000);
            this.conformationService.createTeam(this.tokensave, this.formTeam?.value).subscribe(
              (res: any) => {
                this.swalService.confirmation("Ahora forma parte del equipo como administrador");
                this.getUserTeams();
                this.listIdeasTeam();
              },
              (error) => {
                this.swalService.error(error.error.data.error);
              }
            )
            
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            this.swalService.confirmation("Ingreso al equipo exitosa")
          }
      })
    } else if (!this.profileUser.administrator && this.profileUser.rol != 'userBusinessUnit' && this.profileUser.rol != 'userGovernmentEntity') {
      this.formTeam?.get('ideaId')?.setValue(id);
      this.swalService.loading(1000000);
      this.conformationService.createTeam(this.tokensave, this.formTeam?.value).subscribe(
        (res: any) => {
          this.swalService.confirmation("Inscripción al equipo exitosa");
          this.getUserTeams();
          this.listIdeasTeam();
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    }
    this.buildForms();
  }

  dataEnte(need, event): void {
    if (need != null) {
      if (event.target.checked) {
        const needs = {
          idIdea: this.idTemp,
          idNeed: need._id,
        }
        this.needsArrayTeam.push(needs);
      } else {
        this.needsArrayTeam = this.needsArrayTeam.filter((m) => m.idNeed != need._id);
      }

    } else {
      if (event.target.checked) {
        this.formTeam?.addControl('administrator', this.fb.control(true));
      } else {
        this.formTeam?.removeControl('administrator');
      }
    }
  }

  sendEnte(): void {
    if (this.needsArrayTeam.length == 0 && this.formTeam?.get('administrator') == null ) {
      this.swalService.error('Debe escoger por lo menos una necesidad a suplir');
    } else {
      this.swalService.loading(1000000);
      this.formTeam?.get('ideaId')?.setValue(this.idTemp);
      if (this.formTeam?.get('administrator') == null) {
        this.formTeam?.addControl('needs', this.fb.control(this.needsArrayTeam));
      }
      this.conformationService.createTeam(this.tokensave, this.formTeam?.value).subscribe(
        (res: any) => {
          this.swalService.confirmation("Inscripción al equipo exitosa");
          this.getUserTeams();
          this.listIdeasTeam()
          this.modalService.hide();
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    }
  }

  removeTeam(id): void {
    Swal.fire({
      title: '¿Quiere retirarse del equipo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.conformationService.deleteTeam(this.tokensave, id).subscribe(
            (res: any) => {
              this.swalService.confirmation("Se ha retirado exitosamente");
              this.getUserTeams();
              this.listIdeasTeam();
            },
            (error) => {
              this.swalService.error(error.error.data.error)
            }
          )
        }
      }
    );
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
          this.conformationService.changePhaseIdeation(this.tokensave, idIdea).subscribe(
            (res: any) => {
              this.swalService.confirmation('La idea ha cambiado de fase');
              this.getUserTeams();
              this.listIdeasTeam();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          ) 
        }
      }
    );
  }

  processIdea(id, phase) {
    this.processService.getProcessIdea(this.tokensave, id).subscribe(
      (res: any) => {
        this.processData = res.data.data[0];
        var rols = [
          {
            code: 'creator',
            name: 'Creador',
            state: false
          },
          {
            code: 'administrator',
            name: 'Administrador',
            state: false
          },
          {
            code: 'userCompany',
            name: 'Compañía',
            state: false
          },
          {
            code: 'userExpert',
            name: 'Academia',
            state: false
          },
          {
            code: 'userGovernmentEntity',
            name: 'Ente Gubernamental',
            state: false
          },
        ]

        this.processData.teambuildings.forEach(
          (element) => {
            rols.forEach(
              (campo) => {
                if (element.rol === campo.code) {
                  campo.state = true;
                }
              }
            )
          }
        );

        const totalRols = rols.filter((dato) => !dato.state);
        
        if (totalRols.length > 0) {
          if(phase === 'teamBuilding') {
            var persons = '';
            totalRols.forEach(
              (data) => {
                persons += '<br>' + data.name;
              }
            )
            Swal.fire({
              title: 'Información',
              html: 'El equipo actualmente está conformado por ' + this.processData.teambuildings.length + ' integrantes. Los roles faltantes son: '
              + persons,
              icon: 'info',
              confirmButtonColor: '#3e8457',
            })
          } else {
            Swal.fire({
              title: 'Información',
              html: 'El equipo actualmente está conformado por ' + this.processData.teambuildings.length + ' integrantes. Más información en las etapas correspondientes',
              icon: 'info',
              confirmButtonColor: '#3e8457',
            })
          }
        } else {
          Swal.fire({
            title: 'Información',
            html: 'El equipo actualmente está conformado por ' + this.processData.teambuildings.length + ' integrantes. La cuadrihélice está completa',
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
}
