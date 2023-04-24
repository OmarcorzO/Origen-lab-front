import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { SwalService } from "../../services/swal.service";
import { ValidationMessagesService } from "../../services/validation-messages.service";
import { NewIdeaService } from "../services/new-idea.service";

@Component({
  selector: "app-new-idea",
  templateUrl: "./new-idea.component.html",
  styleUrls: ["./new-idea.component.scss"],
})
export class NewIdeaComponent implements OnInit {
  public tokensave: any;

  formSubmitted = false;

  constructor(
    public fb: FormBuilder,
    public services: NewIdeaService,
    public swalServ: SwalService,
    public validateService: ValidationMessagesService
  ) {}

  public ideaForm = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(10)]],
    description: ["", [Validators.required, Validators.minLength(20)]],
    visualization: [false, [Validators.required]],
    anexoOne: [""],
    anexoTwo: [""],
    anexoThree: [""],

    controlsIdea: this.fb.array([this.fb.control('')]),
  });

  get controlsIdea() {
    return this.ideaForm.get('controlsIdea') as FormArray;
  }

  ngOnInit(): void {
    if (localStorage.getItem("TOKEN") !== null) {
      this.tokensave = localStorage.getItem("TOKEN");
    }
  }

  createIdea(): void {
    this.formSubmitted = true;
    
    (<HTMLFormElement>document.getElementById("ideaForm")).setAttribute(
      "class",
      "was-validated"
    );
    this.ideaForm.patchValue({
      name: this.ideaForm.value.name?.trim(),
      description: this.ideaForm.value.description?.trim(),
    })
    
    if (this.ideaForm.invalid) {
      this.swalServ.error("Datos erróneos");
    } else {
      this.checkAnexos();
      this.services.createIdea(this.ideaForm.value, this.tokensave).subscribe(
        (res) => {
          this.swalServ.confirmation("Idea creada exitosamente");
          this.restaureForm();
        },
        (error) => {
          console.log(error);
          this.swalServ.error(error.error.data.message);
        }
      );
    }
  }

  cleanDataEdit() {
    this.ideaForm.reset();
    this.restaureForm();
  }

  // *Sección de validaciones*
  getErrorMessage(field: string): string {
    return this.validateService.getErrorMessage(field, this.ideaForm)
  }

  invalidField(field: string): boolean {
    return this.validateService.invalidField(field, this.ideaForm, this.formSubmitted)
  }

  checkVi(e) {
    if (e.checked) {
      this.ideaForm.patchValue({
        visualization: true,
      });
    } else {
      this.ideaForm.patchValue({
        visualization: false,
      });
    }
  }

  checkAnexos(): void {
    if (this.ideaForm.value.anexoOne === "") {
      for (let index = 0; index < this.controlsIdea.length; index++) {
        if (this.controlsIdea[index] === 'anexoOne') {
          this.controlsIdea.removeAt(index);
        }
      }
      // this.ideaForm.removeControl("anexoOne");
    }
    if (this.ideaForm.value.anexoTwo === "") {
      for (let index = 0; index < this.controlsIdea.length; index++) {
        if (this.controlsIdea[index] === 'anexoTwo') {
          this.controlsIdea.removeAt(index);
        }
      }
      // this.ideaForm.removeControl("anexoTwo");
    }
    if (this.ideaForm.value.anexoThree === "") {
      for (let index = 0; index < this.controlsIdea.length; index++) {
        if (this.controlsIdea[index] === 'anexoThree') {
          this.controlsIdea.removeAt(index);
        }
      }
      // this.ideaForm.removeControl("anexoThree");
    }
  }

  restaureForm(): void {
    this.ideaForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(10)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      visualization: [false, [Validators.required]],
      anexoOne: [""],
      anexoTwo: [""],
      anexoThree: [""],
  
      controlsIdea: this.fb.array([this.fb.control('')]),
    });

    (<HTMLFormElement>document.getElementById("ideaForm")).classList.remove(
      "was-validated"
    );
    this.formSubmitted = false;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let data = file.name.split('.');
      if (data[data.length-1].toLowerCase() === 'png' || data[data.length-1].toLowerCase() === 'pdf' || data[data.length-1].toLowerCase() === 'jpg') {
        switch (event.target.id) {
          case "anexoOne":
            this.ideaForm.get("anexoOne")?.setValue(file);
            break;
          case "anexoTwo":
            this.ideaForm.get("anexoTwo")?.setValue(file);
            break;
          case "anexoThree":
            this.ideaForm.get("anexoThree")?.setValue(file);
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
          this.ideaForm.patchValue({
            anexoOne: "",
          });
          break;
        case "anexoTwo":
          this.ideaForm.patchValue({
            anexoTwo: "",
          });
          break;
        case "anexoThree":
          this.ideaForm.patchValue({
            anexoThree: "",
          });
          break;
        default:
          break;
      }
    }
  }
}
