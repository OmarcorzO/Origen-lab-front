import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SwalService } from "../../services/swal.service";
import { MyIdeaService } from "../services/my-idea.service";
import { ValidationMessagesService } from "../../services/validation-messages.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-my-idea",
  templateUrl: "./my-idea.component.html",
  styleUrls: ["./my-idea.component.scss"],
})
export class MyIdeaComponent implements OnInit {
  public tokensave: string = '';

  // Paginator and Array
  public arrayIdeas: any[] = [];
  public listReactionType: any[] = [];

  currentPage: number = 1;

  sizePage: number = 5;

  totalItems: number = 0;

  // Modal
  modalEdit!: BsModalRef;

  // Forms
  formEditIdea: FormGroup;
  formEditAnexo: FormGroup;

  // Validador Anexos
  sizeOne: boolean = false;
  sizeTwo: boolean = false;
  sizeThree: boolean = false;

  formSubmitted = false;

  constructor(
    public service: MyIdeaService,
    public modalService: BsModalService,
    public fb: FormBuilder,
    public swalServ: SwalService,
    public validateService: ValidationMessagesService
  ) {
    this.formEditIdea = this.fb.group({
      ideaId: [""],
      name: ["", [Validators.required, Validators.minLength(10)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      visualization: [false, [Validators.required]],
    });

    this.formEditAnexo = this.fb.group({
      ideaId: [""],
      anexoOne: [""],
      anexoTwo: [""],
      anexoThree: [""],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem("TOKEN") !== null) {
      this.tokensave = localStorage.getItem("TOKEN") ?? '';
    }
    this.getData();
  }

  // Carga la información de las ideas
  getData() {
    this.swalServ.searching();
    this.service.listMyIdea(this.tokensave).subscribe(
      (res: any) => {
        this.swalServ.close();
        this.arrayIdeas = res.data.value;
        this.totalItems = this.arrayIdeas.length * 10;
      },
      (error) => {
        this.swalServ.checkError(error.status);
      }
    );

    this.service.listReactionType(this.tokensave).subscribe(
      (res: any) => {
        this.listReactionType = res.data.value;
      },
      (error) => {
        this.swalServ.checkError(error.status);
      }
    );
  }

  // Abre el modal de edición de idea
  openModalEditIdea(template, idea): void {
    this.modalEdit = this.modalService.show(template, {class: 'modal-dialog-centered'});

    this.resetAnexos();

    // Asigno al form y consulto anexos
    this.formEditAnexo?.get("ideaId")?.setValue(idea._id);
    this.getAnexoIdea(idea._id);

    this.formEditIdea.patchValue({
      ideaId: idea._id,
      name: idea.name,
      description: idea.description,
      visualization: idea.visualization,
    });

    if (idea.visualization === "true") {
      (<HTMLInputElement>document.getElementById("visualization")).setAttribute(
        "checked",
        ""
      );
    }
  }

  // Actualizar idea
  updateIdea(): void {
    this.formSubmitted = true;
    (<HTMLFormElement>document.getElementById("formEditIdea")).setAttribute(
      "class",
      "was-validated"
    );

    this.formEditIdea.patchValue({
      name: this.formEditIdea.value.name.trim(),
      description: this.formEditIdea.value.description.trim(),
    })
    if (this.formEditIdea.invalid) {
      this.swalServ.error("Datos erróneos");
    } else {
      this.service.editIdea(this.formEditIdea.value, this.tokensave).subscribe(
        (res) => {
          this.swalServ.confirmation("Idea actualizada exitosamente");
          this.getData();
          this.modalEdit?.hide();
        },
        (error) => {
          this.swalServ.error(error.error.data.error.details[0].message);
          // console.log(error);
        }
      );
    }
  }

  // *Sección de validaciones*
  getErrorMessage(field: string): string {
    return this.validateService.getErrorMessage(field, this.formEditIdea)
  }

  // Validador de campos
  invalidField(field: string): boolean {
    return this.validateService.invalidField(field, this.formEditIdea, this.formSubmitted)
  }

  // Captura los cambios de los input file
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let data = file.name.split('.');
      if (data[data.length-1].toLowerCase() === 'png' || data[data.length-1].toLowerCase() === 'pdf' || data[data.length-1].toLowerCase() === 'jpg') {
        this.swalServ.loadingWithText("Subiendo Anexo", 600);
        switch (event.target.id) {
          case "anexoOne":
              this.formEditAnexo?.get("anexoOne")?.setValue(file);
              this.createAnexo(this.formEditAnexo.value, event.target.id);
              this.sizeOne = false;
            break;
          case "anexoTwo":
            this.formEditAnexo?.get("anexoTwo")?.setValue(file);
            this.createAnexo(this.formEditAnexo.value, event.target.id);
            this.sizeTwo = false;
            break;
          case "anexoThree":
            this.formEditAnexo?.get("anexoThree")?.setValue(file);
            this.createAnexo(this.formEditAnexo.value, event.target.id);
            this.sizeThree = false;
            break;
          default:
            break;
        }
      } else {
        this.swalServ.error('Solo se permiten archivos: pdf o imagen')
      }
     
    } else {
      switch (event.target.id) {
        case "anexoOne":
          this.formEditAnexo?.get("anexoOne")?.setValue("");
          this.sizeOne = false;
          break;
        case "anexoTwo":
          this.formEditAnexo?.get("anexoTwo")?.setValue("");
          this.sizeTwo = false;
          break;
        case "anexoThree":
          this.formEditAnexo?.get("anexoThree")?.setValue("");
          this.sizeThree = false;
          break;
        default:
          break;
      }
    }
  }

  // Verifica el switch de visualization
  checkVi(e) {
    if (e.checked) {
      this.formEditIdea.patchValue({
        visualization: "true",
      });
    } else {
      this.formEditIdea.patchValue({
        visualization: "false",
      });
    }
  }

  // Obtener Anexos específicos
  getAnexoIdea(idea): void {
    const ideaObject = {
      ideaId: idea,
    };

    this.service.getSpecificIdea(this.tokensave, ideaObject).subscribe(
      (res: any) => {
        const idea = res.data.value[0];

        const anexos = idea.idea_anexos;

        if (anexos.length !== 0) {
          anexos.forEach((element) => {
            switch (element.anexo) {
              case "anexoOne":
                this.formEditAnexo?.get("anexoOne")?.setValue(element);
                (<HTMLInputElement>document.getElementById('anexoOne')).disabled = true;
                this.sizeOne = true;
                break;
              case "anexoTwo":
                this.formEditAnexo?.get("anexoTwo")?.setValue(element);
                (<HTMLInputElement>document.getElementById('anexoTwo')).disabled = true;
                this.sizeTwo = true;
                break;
              case "anexoThree":
                this.formEditAnexo?.get("anexoThree")?.setValue(element);
                (<HTMLInputElement>document.getElementById('anexoThree')).disabled = true;
                this.sizeThree = true;
                break;
              default:
                break;
            }
          });
        } else {
          this.formEditAnexo.patchValue({
            anexoOne: "",
            anexoTwo: "",
            anexoThree: "",
          });
          this.sizeOne = false;
          this.sizeTwo = false;
          this.sizeThree = false;
        }
      },
      (error) => {
        this.swalServ.error("Fallos en la búsqueda");
      }
    );
  }

  // Actualizar Anexo
  createAnexo(anexoForm, nameAnexo): void {
    this.service.createAnexo(this.tokensave, anexoForm, nameAnexo).subscribe(
      (res: any) => {
        this.getAnexoIdea(this.formEditAnexo.value.ideaId);
      },
      (error) => {
        const mesg = error.error.data.error;
        this.swalServ.error(mesg);
      }
    );
  }

  // Elimina el anexo cargado
  deleteAnexo(data): void {
    Swal.fire({
      title: '¿Desea eliminar el anexo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          const ideaObject = {
            ideaId: this.formEditAnexo.value.ideaId,
            ideaAnexoId: "",
          };
      
          switch (data) {
            case "anexoOne":
              ideaObject.ideaAnexoId = this.formEditAnexo.value.anexoOne._id;
              this.formEditAnexo?.get("anexoOne")?.setValue("");
              (<HTMLInputElement>document.getElementById('anexoOne')).disabled = false;
              this.sizeOne = false;
              break;
            case "anexoTwo":
              ideaObject.ideaAnexoId = this.formEditAnexo.value.anexoTwo._id;
              this.formEditAnexo?.get("anexoTwo")?.setValue("");
              (<HTMLInputElement>document.getElementById('anexoTwo')).disabled = false;
              this.sizeTwo = false;
              break;
            case "anexoThree":
              ideaObject.ideaAnexoId = this.formEditAnexo.value.anexoThree._id;
              this.formEditAnexo?.get("anexoThree")?.setValue("");
              (<HTMLInputElement>document.getElementById('anexoThree')).disabled = false;
              this.sizeThree = false;
              break;
      
            default:
              break;
          }
      
          this.service.deleteAnexo(this.tokensave, ideaObject).subscribe(
            (res: any) => {
              this.swalServ.confirmation("Registro eliminado exitosamente");
              this.getAnexoIdea(this.formEditAnexo.value.ideaId);
            },
            (error) => {
              this.swalServ.error("Error inesperado");
            }
          );
        }
      }
    )
  }

  // Al abrir el edit se reinicia
  resetAnexos(): void {
    this.formEditAnexo.patchValue({
      anexoOne: "",
      anexoTwo: "",
      anexoThree: "",
    });

    this.sizeOne = false;
    this.sizeTwo = false;
    this.sizeThree = false;
  }

  searchReaction(type, code) {  
    const reactionType = this.listReactionType.filter(
      (element: any) => element.code == code
    );

    if (reactionType.length != 0) {
      const reaction = type.filter(
        (element: any) => element._id == reactionType[0]._id
      );

      if (reaction.length == 0) {
        return 0;
      } else {
        return reaction[0].count;
      }
    }
  }
}
