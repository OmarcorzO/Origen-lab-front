import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthService } from 'src/app/views/auth/services/auth.service';
import { SwalService } from 'src/app/views/services/swal.service';
import { navItemsEnte, navItemsNull, navItemsUser } from '../_nav';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public sidebarMinimized = false;
  public profileActive = false;
  public navItems: any;
  public state: string = '';

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  img_default = "../../../assets/img/photoProfile.png";

  public profile: any = {
    name: 'Usuario',
    lastname: 'Temporal',
    phone: '303030303',
    rol: 'nulo',
    imgCloud: this.img_default,
  };

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  
  constructor(private classToggler: ClassToggleService, private route: Router, private services: AuthService, public swalService: SwalService) {
    super();
    const tokensave = localStorage.getItem('TOKEN');
  
    if (tokensave !== null) {
      // this.route.events.subscribe((event: Event) => {
      //   if (event instanceof NavigationEnd) {
      //     this.state = event.url;
      //   }
      // });
      
      this.services.rolList(tokensave).subscribe(
        (res: any) => {
          const rolList: any[] = res.data.value;

          this.services.getProfile(tokensave).subscribe(
            (res: any) => {
              if(res.data.profile !== null) {
      
                this.profile = {
                  name: res.data.profile.name,
                  lastname: res.data.profile.lastname,
                  phone: res.data.profile.phone,
                  rol: res.data.profile.rol,
                  imgCloud: res.data.profile.img,
                }

                this.profileActive = res.data.profile.is_active;
                const rol = rolList.find((m) => m._id == this.profile.rol)
                this.profile.rol = rol.code;
              }
              if (this.profileActive) {
                switch (this.profile.rol) {
                  case 'userGovernmentEntity':
                    this.navItems = navItemsEnte;
                    break;
                  case 'nulo':
                    this.navItems = navItemsNull;
                    break;
                  case 'userBusinessUnit':
                  case 'userCompany':
                  case 'userExpert':
                    this.navItems = navItemsUser;
                    break;
                
                  default:
                    break;
                }
              } else {
                this.navItems = navItemsNull;
              }
            },
            (error) => {
              this.swalService.checkError(error.status);
            }
          )
        },
        (error) => {
          this.swalService.checkError(error.status);
        }
      )
    }
  }

  logout() {
    localStorage.removeItem('TOKEN');
    var body = document.getElementsByTagName('body').item(0);
    body?.classList.toggle('aside-menu-show')
    this.route.navigateByUrl('/login');
  }
}


