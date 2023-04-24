import { Component, OnInit } from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public tokensave: any;

  formSubmitted: boolean = false;

  codeRol: string = '';

  img_default =
    'https://res.cloudinary.com/solucionesamericana/image/upload/v1648248505/photoProfileDefault_h7htdw.png';

  hasProfile: boolean = false;

  public tempImg: any;

  public rolList: any = 0;

  public profileUser!: [];

  // FORM ROLES
  public userBusinessUnitForm!: FormGroup;
  public userCompanyForm!: FormGroup;
  public userExpertForm!: FormGroup;
  public userGovernmentEntityForm!: FormGroup;

  public levelStudyList = [
    'Primaria',
    'Bachillerato',
    'Técnico',
    'Tecnólogo',
    'Profesional',
    'Magister',
    'Doctorado',
  ];

  public profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    lastname: ['', [Validators.required, Validators.minLength(4)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    rol: ['', [Validators.required]],

    controlsProfile: this.fb.array([this.fb.control('')]),
  });

  public editProfileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    lastname: ['', [Validators.required, Validators.minLength(4)]],
    phone: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(10)],
    ],
    rol: ['', [Validators.required]],
    administrator: [''],
    password: [''],
    img: [''],
    imgCloud: [''],

    controlsEdit: this.fb.array([this.fb.control('')]),
  });

  get controlsEdit() {
    return this.editProfileForm.get('controlsEdit') as FormArray;
  }

  get controlsProfile() {
    return this.profileForm.get('controlsProfile') as FormArray;
  }

  initRolForms() {
    this.userBusinessUnitForm = this.fb.group({
      sector: ['', [Validators.required, Validators.minLength(3)]],
      socialObject: ['', [Validators.required, Validators.minLength(5)]],
      levelStudy: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.userCompanyForm = this.fb.group({
      address: ['', [Validators.required]],
      sector: ['', [Validators.required, Validators.minLength(3)]],
      socialObject: ['', [Validators.required, Validators.minLength(5)]],
      companyName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.userExpertForm = this.fb.group({
      college: ['', [Validators.required]],
      position: ['', [Validators.required, Validators.minLength(3)]],
      profession: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.userGovernmentEntityForm = this.fb.group({
      functions: ['', [Validators.required, Validators.minLength(5)]],
      position: ['', [Validators.required, Validators.minLength(5)]],
      profession: ['', [Validators.required, Validators.minLength(5)]],
      governorateMunicipality: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
    });
  }

  constructor(
    private nav: Router,
    private fb: FormBuilder,
    private services: AuthService,
    private validateService: ValidationMessagesService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.initRolForms();
    if (localStorage.getItem('TOKEN') !== null) {
      this.tokensave = localStorage.getItem('TOKEN');
    }

    this.chargeDataProfile();
  }

  chargeDataProfile(): void {
    this.services.rolList(this.tokensave).subscribe(
      (res: any) => {
        this.rolList = res.data.value;

        this.services.getProfile(this.tokensave).subscribe(
          (res: any) => {
            if (res.data.profile !== null) {
              this.hasProfile = true;

              var valPos: any = this.rolList.filter(
                (formArray: any) => formArray._id === res.data.profile.rol
              );
              this.codeRol = valPos[0].code;
              this.chargeDataRoles(this.codeRol, res.data.profile);

              this.editProfileForm.patchValue({
                name: res.data.profile.name,
                lastname: res.data.profile.lastname,
                phone: res.data.profile.phone,
                rol: res.data.profile.rol,
                administrator: res.data.profile.administrator,
                imgCloud: res.data.profile.img,
              });

              this.tempImg = this.editProfileForm.value.imgCloud;
            }
          },
          (error) => {
            this.swalService.checkError(error.status);
          }
        );
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    );
  }

  registerProfile(): void {
    this.formSubmitted = true;
    var sw = this.checkFormInvalid();
    this.profileForm.patchValue({
      name: this.profileForm.value.name?.trim(),
      lastname: this.profileForm.value.lastname?.trim(),
      phone: this.profileForm.value.phone?.trim(),
    });

    if (this.profileForm.invalid || sw) {
      Swal.fire('Error', 'Perfil incorrecto, verifique los campos', 'error');
      (<HTMLFormElement>document.getElementById('profileForm')).setAttribute(
        'class',
        'was-validated'
      );
      switch (this.codeRol) {
        case 'userBusinessUnit':
          (<HTMLFormElement>(
            document.getElementById('userBusinessUnitForm')
          )).setAttribute('class', 'was-validated');
          break;
        case 'userCompany':
          (<HTMLFormElement>(
            document.getElementById('userCompanyForm')
          )).setAttribute('class', 'was-validated');
          break;
        case 'userExpert':
          (<HTMLFormElement>(
            document.getElementById('userExpertForm')
          )).setAttribute('class', 'was-validated');
          break;
        case 'userGovernmentEntity':
          (<HTMLFormElement>(
            document.getElementById('userGovernmentEntityForm')
          )).setAttribute('class', 'was-validated');
          break;

        default:
          break;
      }
    } else {
      this.addRolProfile();
      this.services
        .registerProfile(this.profileForm.value, this.tokensave)
        .subscribe(
          (res) => {
            Swal.fire({
              title: 'Confirmado',
              text: 'Registro de perfil satisfactorio, esperando confirmación del administrador',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3e8457',
            }).then(() => {
              location.reload();
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              html: `${error}`,
              icon: 'error',
              confirmButtonColor: '#3e8457',
            });
          }
        );
      this.removeRolProfile();
    }
  }

  updateProfile(): void {
    this.formSubmitted = true;
    var sw = this.checkFormInvalid();
    this.editProfileForm.patchValue({
      name: this.editProfileForm.value.name?.trim(),
      lastname: this.editProfileForm.value.lastname?.trim(),
      phone: this.editProfileForm.value.phone?.trim(),
    });

    if (this.editProfileForm.invalid || sw) {
      Swal.fire({
        title: 'Error',
        text: `Perfil incorrecto, verifique los campos`,
        icon: 'error',
        confirmButtonColor: '#3e8457',
      });
      (<HTMLFormElement>(
        document.getElementById('editProfileForm')
      )).setAttribute('class', 'was-validated');
      switch (this.codeRol) {
        case 'userBusinessUnit':
          (<HTMLFormElement>(
            document.getElementById('userBusinessUnitForm')
          )).setAttribute('class', 'was-validated');
          break;
        case 'userCompany':
          (<HTMLFormElement>(
            document.getElementById('userCompanyForm')
          )).setAttribute('class', 'was-validated');
          break;
        case 'userExpert':
          (<HTMLFormElement>(
            document.getElementById('userExpertForm')
          )).setAttribute('class', 'was-validated');
          break;
        case 'userGovernmentEntity':
          (<HTMLFormElement>(
            document.getElementById('userGovernmentEntityForm')
          )).setAttribute('class', 'was-validated');
          break;

        default:
          break;
      }
    } else {
      Swal.fire({
        title: '¿Desea actualizar su perfil?',
        html: 'Tenga en cuenta que su perfil deberá ser validado nuevamente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: '#3e8457',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.editProfileForm.value.password?.trim() === '') {
            for (let index = 0; index < this.controlsEdit.length; index++) {
              if (this.controlsProfile[index] === 'password') {
                this.controlsProfile.removeAt(index);
              }
            }
            // for(let index of this.controlsEdit.controls) {
            //   console.log(index);
            // this.controlsEdit.removeAt(index)
            // }
          }
          this.addRolEditProfile();
          this.services
            .updateProfile(this.editProfileForm.value, this.tokensave)
            .subscribe(
              (res) => {
                Swal.fire({
                  title: 'Confirmado',
                  text: 'Actualización de perfil satisfactoria',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3e8457',
                }).then(() => {
                  location.reload();
                });
              },
              (error) => {
                Swal.fire({
                  title: 'Error',
                  html: `${error}`,
                  icon: 'error',
                  confirmButtonColor: '#3e8457',
                });
              }
            );
          this.removeRolEditProfile();
          this.editProfileForm.addControl('password', this.fb.control(''));
        }
      });
    }
  }

  cleanData() {
    (<HTMLFormElement>document.getElementById('profileForm')).reset();

    switch (this.codeRol) {
      case 'userBusinessUnit':
        (<HTMLFormElement>(
          document.getElementById('userBusinessUnitForm')
        )).reset();
        break;
      case 'userCompany':
        (<HTMLFormElement>document.getElementById('userCompanyForm')).reset();
        break;
      case 'userExpert':
        (<HTMLFormElement>document.getElementById('userExpertForm')).reset();
        break;
      case 'userGovernmentEntity':
        (<HTMLFormElement>(
          document.getElementById('userGovernmentEntityForm')
        )).reset();
        break;

      default:
        break;
    }

    (<HTMLFormElement>document.getElementById('profileForm')).classList.remove(
      'was-validated'
    );
    this.formSubmitted = false;
    this.codeRol = '';
  }

  cleanDataEdit() {
    this.editProfileForm.reset();

    switch (this.codeRol) {
      case 'userBusinessUnit':
        (<HTMLFormElement>(
          document.getElementById('userBusinessUnitForm')
        )).reset();
        break;
      case 'userCompany':
        (<HTMLFormElement>document.getElementById('userCompanyForm')).reset();
        break;
      case 'userExpert':
        (<HTMLFormElement>document.getElementById('userExpertForm')).reset();
        break;
      case 'userGovernmentEntity':
        (<HTMLFormElement>(
          document.getElementById('userGovernmentEntityForm')
        )).reset();
        break;

      default:
        break;
    }

    (<HTMLFormElement>(
      document.getElementById('editProfileForm')
    )).classList.remove('was-validated');
    this.formSubmitted = false;
    this.codeRol = '';
  }

  // *Sección de validaciones*
  getErrorMessageCreate(field: string): string {
    return this.validateService.getErrorMessage(field, this.profileForm);
  }

  // *Sección de validaciones*
  getErrorMessageEdit(field: string): string {
    return this.validateService.getErrorMessage(field, this.editProfileForm);
  }

  getErrorMessageRol(field: string) {
    switch (this.codeRol) {
      case 'userBusinessUnit':
        return this.validateService.getErrorMessage(
          field,
          this.userBusinessUnitForm
        );
        break;
      case 'userCompany':
        return this.validateService.getErrorMessage(
          field,
          this.userCompanyForm
        );
        break;
      case 'userExpert':
        return this.validateService.getErrorMessage(field, this.userExpertForm);
        break;
      case 'userGovernmentEntity':
        return this.validateService.getErrorMessage(
          field,
          this.userGovernmentEntityForm
        );
        break;
      default:
        return '';
        break;
    }
  }

  invalidFieldCreate(field: string): boolean {
    return this.validateService.invalidField(
      field,
      this.profileForm,
      this.formSubmitted
    );
  }

  invalidFieldEdit(field: string): boolean {
    return this.validateService.invalidField(
      field,
      this.editProfileForm,
      this.formSubmitted
    );
  }

  invalidFieldRol(field: string) {
    switch (this.codeRol) {
      case 'userBusinessUnit':
        return this.validateService.invalidField(
          field,
          this.userBusinessUnitForm,
          this.formSubmitted
        );
        break;
      case 'userCompany':
        return this.validateService.invalidField(
          field,
          this.userCompanyForm,
          this.formSubmitted
        );
        break;
      case 'userExpert':
        return this.validateService.invalidField(
          field,
          this.userExpertForm,
          this.formSubmitted
        );
        break;
      case 'userGovernmentEntity':
        return this.validateService.invalidField(
          field,
          this.userGovernmentEntityForm,
          this.formSubmitted
        );
        break;

      default:
        return '';
        break;
    }
  }

  checkRol(e: Event): void {
    var valPos;

    this.formSubmitted = false;
    (<HTMLFormElement>document.getElementById('profileForm')).classList.remove(
      'was-validated'
    );

    valPos = this.rolList.filter((formArray: any) => formArray._id === e);
    this.codeRol = valPos[0].code;

    this.initRolForms();
  }

  checkRolEdit(e: Event): void {
    var valPos;

    this.formSubmitted = false;
    (<HTMLFormElement>(
      document.getElementById('editProfileForm')
    )).classList.remove('was-validated');

    valPos = this.rolList.filter((formArray: any) => formArray._id === e);
    this.codeRol = valPos[0].code;

    this.initRolForms();
  }

  checkFormInvalid(): boolean {
    var value = false;
    switch (this.codeRol) {
      case 'userBusinessUnit':
        if (this.userBusinessUnitForm.invalid) {
          value = true;
        }
        break;
      case 'userCompany':
        if (this.userCompanyForm.invalid) {
          value = true;
        }
        break;
      case 'userExpert':
        if (this.userExpertForm.invalid) {
          value = true;
        }
        break;
      case 'userGovernmentEntity':
        if (this.userGovernmentEntityForm.invalid) {
          value = true;
        }
        break;
      default:
        break;
    }

    return value;
  }

  addRolProfile(): void {
    switch (this.codeRol) {
      case 'userBusinessUnit':
        this.controlsProfile.push(
          this.fb.control(this.userBusinessUnitForm.value.sector.trim())
        );
        this.controlsProfile.push(
          this.fb.control(this.userBusinessUnitForm.value.socialObject.trim())
        );
        this.controlsProfile.push(
          this.fb.control(this.userBusinessUnitForm.value.levelStudy.trim())
        );
        // this.profileForm.addControl(
        //   'sector',
        //   this.fb.control(this.userBusinessUnitForm.value.sector.trim())
        // );
        // this.profileForm.addControl(
        //   'socialObject',
        //   this.fb.control(this.userBusinessUnitForm.value.socialObject.trim())
        // );
        // this.profileForm.addControl(
        //   'levelStudy',
        //   this.fb.control(this.userBusinessUnitForm.value.levelStudy.trim())
        // );
        break;
      case 'userCompany':
        this.controlsProfile.push(
          this.fb.control(this.userCompanyForm.value.address.trim())
        ),
          this.controlsProfile.push(
            this.fb.control(this.userCompanyForm.value.sector.trim())
          ),
          this.controlsProfile.push(
            this.fb.control(this.userCompanyForm.value.socialObject.trim())
          ),
          this.controlsProfile.push(
            this.fb.control(this.userCompanyForm.value.companyName.trim())
          );
        // this.profileForm.addControl(
        //   'address',
        //   this.fb.control(this.userCompanyForm.value.address.trim())
        // );
        // this.profileForm.addControl(
        //   'sector',
        //   this.fb.control(this.userCompanyForm.value.sector.trim())
        // );
        // this.profileForm.addControl(
        //   'socialObject',
        //   this.fb.control(this.userCompanyForm.value.socialObject.trim())
        // );
        // this.profileForm.addControl(
        //   'companyName',
        //   this.fb.control(this.userCompanyForm.value.companyName.trim())
        // );
        break;
      case 'userExpert':
        this.controlsProfile.push(
          this.fb.control(this.userExpertForm.value.college.trim())
        );
        this.controlsProfile.push(
          this.fb.control(this.userExpertForm.value.position.trim())
        );
        this.controlsProfile.push(
          this.fb.control(this.userExpertForm.value.profession.trim())
        );
        // this.profileForm.addControl(
        //   'college',
        //   this.fb.control(this.userExpertForm.value.college.trim())
        // );
        // this.profileForm.addControl(
        //   'position',
        //   this.fb.control(this.userExpertForm.value.position.trim())
        // );
        // this.profileForm.addControl(
        //   'profession',
        //   this.fb.control(this.userExpertForm.value.profession.trim())
        // );
        break;
      case 'userGovernmentEntity':
        this.controlsProfile.push(
          this.fb.control(this.userGovernmentEntityForm.value.functions.trim())
        );
        this.controlsProfile.push(
          this.fb.control(this.userGovernmentEntityForm.value.position.trim())
        );
        this.controlsProfile.push(
          this.fb.control(this.userGovernmentEntityForm.value.profession.trim())
        );
        this.controlsProfile.push(
          this.fb.control(
            this.userGovernmentEntityForm.value.governorateMunicipality.trim()
          )
        );
        // this.profileForm.addControl(
        //   'functions',
        //   this.fb.control(this.userGovernmentEntityForm.value.functions.trim())
        // );
        // this.profileForm.addControl(
        //   'position',
        //   this.fb.control(this.userGovernmentEntityForm.value.position.trim())
        // );
        // this.profileForm.addControl(
        //   'profession',
        //   this.fb.control(this.userGovernmentEntityForm.value.profession.trim())
        // );
        // this.profileForm.addControl(
        //   'governorateMunicipality',
        //   this.fb.control(
        //     this.userGovernmentEntityForm.value.governorateMunicipality.trim()
        //   )
        // );
        break;
      default:
        break;
    }
  }

  removeRolProfile(): void {
    switch (this.codeRol) {
      case 'userBusinessUnit':
        for (let index = 0; index < this.controlsProfile.length; index++) {
          if (
            this.controlsProfile[index] === 'sector' ||
            this.controlsProfile[index] === 'socialObject' ||
            this.controlsProfile[index] === 'levelStudy'
          ) {
            this.controlsProfile.removeAt(index);
          }
        }
        break;
      case 'userCompany':
        for (let index = 0; index < this.controlsProfile.length; index++) {
          if (
            this.controlsProfile[index] === 'address' ||
            this.controlsProfile[index] === 'sector' ||
            this.controlsProfile[index] === 'socialObject' ||
            this.controlsProfile[index] === 'companyName'
          ) {
            this.controlsProfile.removeAt(index);
          }
        }
        break;
      case 'userExpert':
        for (let index = 0; index < this.controlsProfile.length; index++) {
          if (
            this.controlsProfile[index] === 'college' ||
            this.controlsProfile[index] === 'position' ||
            this.controlsProfile[index] === 'profession'
          ) {
            this.controlsProfile.removeAt(index);
          }
        }
        break;
      case 'userGovernmentEntity':
        for (let index = 0; index < this.controlsProfile.length; index++) {
          if (
            this.controlsProfile[index] === 'functions' ||
            this.controlsProfile[index] === 'position' ||
            this.controlsProfile[index] === 'profession' ||
            this.controlsProfile[index] === 'governorateMunicipality'
          ) {
            this.controlsProfile.removeAt(index);
          }
        }
        break;
      default:
        break;
    }
  }

  addRolEditProfile(): void {
    switch (this.codeRol) {
      case 'userBusinessUnit':
        this.controlsEdit.push(
          this.fb.control(this.userBusinessUnitForm.value.sector.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userBusinessUnitForm.value.socialObject.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userBusinessUnitForm.value.levelStudy.trim())
        );
        break;
      case 'userCompany':
        this.controlsEdit.push(
          this.fb.control(this.userCompanyForm.value.address.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userCompanyForm.value.sector.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userCompanyForm.value.socialObject.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userCompanyForm.value.companyName.trim())
        );
        break;
      case 'userExpert':
        this.controlsEdit.push(
          this.fb.control(this.userExpertForm.value.college.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userExpertForm.value.position.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userExpertForm.value.profession.trim())
        );
        break;
      case 'userGovernmentEntity':
        this.controlsEdit.push(
          this.fb.control(this.userGovernmentEntityForm.value.functions.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userGovernmentEntityForm.value.position.trim())
        );
        this.controlsEdit.push(
          this.fb.control(this.userGovernmentEntityForm.value.profession.trim())
        );
        this.controlsEdit.push(
          this.userGovernmentEntityForm.value.governorateMunicipality.trim()
        );
        break;
      default:
        break;
    }
  }

  removeRolEditProfile(): void {
    switch (this.codeRol) {
      case 'userBusinessUnit':
        for (let index = 0; index < this.controlsEdit.length; index++) {
          if (
            this.controlsEdit[index] === 'sector' ||
            this.controlsEdit[index] === 'socialObject' ||
            this.controlsEdit[index] === 'levelStudy'
          ) {
            this.controlsEdit.removeAt(index);
          }
        }
        break;
      case 'userCompany':
        for (let index = 0; index < this.controlsEdit.length; index++) {
          if (
            this.controlsEdit[index] === 'address' ||
            this.controlsEdit[index] === 'sector' ||
            this.controlsEdit[index] === 'socialObject' ||
            this.controlsEdit[index] === 'companyName'
          ) {
            this.controlsEdit.removeAt(index);
          }
        }
        break;
      case 'userExpert':
        for (let index = 0; index < this.controlsEdit.length; index++) {
          if (
            this.controlsEdit[index] === 'college' ||
            this.controlsEdit[index] === 'position' ||
            this.controlsEdit[index] === 'profession'
          ) {
            this.controlsEdit.removeAt(index);
          }
        }
        break;
      case 'userGovernmentEntity':
        for (let index = 0; index < this.controlsEdit.length; index++) {
          if (
            this.controlsEdit[index] === 'functions' ||
            this.controlsEdit[index] === 'position' ||
            this.controlsEdit[index] === 'profession' ||
            this.controlsEdit[index] === 'governorateMunicipality'
          ) {
            this.controlsEdit.removeAt(index);
          }
        }
        break;
      default:
        break;
    }
  }

  chargeDataRoles(rol: string, info): void {
    switch (rol) {
      case 'userBusinessUnit':
        this.userBusinessUnitForm.patchValue({
          sector: info.sector,
          socialObject: info.socialObject,
          levelStudy: info.levelStudy,
        });
        break;
      case 'userCompany':
        this.userCompanyForm.patchValue({
          address: info.address,
          sector: info.sector,
          socialObject: info.socialObject,
          companyName: info.companyName,
        });
        break;
      case 'userExpert':
        this.userExpertForm.patchValue({
          college: info.college,
          position: info.position,
          profession: info.profession,
        });
        break;
      case 'userGovernmentEntity':
        this.userGovernmentEntityForm.patchValue({
          functions: info.functions,
          position: info.position,
          profession: info.profession,
          governorateMunicipality: info.governorateMunicipality,
        });
        break;

      default:
        break;
    }
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let data = file.name.split('.');
      if (
        data[data.length - 1].toLowerCase() === 'png' ||
        data[data.length - 1].toLowerCase() === 'jpg'
      ) {
        this.editProfileForm.get('img')?.setValue(file);
        // Cargar imagen
        const reader = new FileReader();
        reader.onload = (image) => {
          const result = image.target?.result as string;
        };
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.tempImg = reader.result;
        };
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Solo se permiten archivos de imagen',
          icon: 'error',
          confirmButtonColor: '#3e8457',
        });
      }
    } else {
      this.editProfileForm.get('img')?.setValue('');
      this.tempImg = this.editProfileForm.value.imgCloud;
    }
  }
}
