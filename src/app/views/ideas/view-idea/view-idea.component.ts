import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { ViewIdeaService } from '../services/view-idea.service';
import {
  cilList,
  cilShieldAlt,
  cilSortAscending,
  cilSortDescending,
  cilThumbUp,
  cilThumbDown,
  cilChatBubble,
  cilX,
} from '@coreui/icons';

@Component({
  selector: 'app-view-idea',
  templateUrl: './view-idea.component.html',
  styleUrls: ['./view-idea.component.scss'],
})
export class ViewIdeaComponent implements OnInit {
  // Icons
  icons = {
    cilList,
    cilShieldAlt,
    cilSortAscending,
    cilSortDescending,
    cilThumbUp,
    cilThumbDown,
    cilChatBubble,
    cilX,
  };

  // Arrays de la visualización
  public arrayPublicIdeas!: any[];
  public arrayComments!: any[];
  public listCommentType;
  public listReactionType;

  // Variables de control
  public topUser: {
    name: string;
    number: number;
  } = {
    name: 'Hola',
    number: 0,
  };
  public ideaView: any = '';
  public ideaIdSelect: string = '';
  public myReaction: string = '';

  // Variables Paginador
  currentPage: number = 1;
  sizePage: number = 2;
  totalItems: number = 0;

  // Forms
  public formComments: FormGroup;
  public formReaction: FormGroup;

  public modalComment!: BsModalRef;

  public tokensave: string = '';

  public cont: number = 1;
  public formSubmitted: boolean = false;

  // Ideas Filters
  public orderView: string = 'desc';
  public fieldView: string = '';

  constructor(
    public service: ViewIdeaService,
    public swalServ: SwalService,
    public modalService: BsModalService,
    public fb: FormBuilder,
    public validateService: ValidationMessagesService
  ) {
    this.formComments = this.fb.group({
      ideaId: ['', [Validators.required]],
      commentTypeId: ['', [Validators.required, Validators.minLength(10)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.formReaction = this.fb.group({
      ideaId: ['', [Validators.required]],
      typeReactionId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.swalServ.searching();
    if (localStorage.getItem('TOKEN') !== null) {
      this.tokensave = localStorage.getItem('TOKEN') ?? '';
    }

    this.service
      .listPublicIdea(this.tokensave, this.cont * 4, 'desc')
      .subscribe(
        (res: any) => {
          this.swalServ.close();
          this.arrayPublicIdeas = res.data.value;
        },
        (error) => {
          this.swalServ.checkError(error.status);
        }
      );

    this.service.listCommentType(this.tokensave, 'desc').subscribe(
      (res: any) => {
        this.listCommentType = res.data.value;
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

  moreIdeas() {
    this.cont++;
    if (this.fieldView === '') {
      this.service
        .listPublicIdea(this.tokensave, this.cont * 4, this.orderView)
        .subscribe(
          (res: any) => {
            this.arrayPublicIdeas = res.data.value;
          },
          (error) => {
            this.swalServ.checkError(error.status);
          }
        );
    } else {
      this.service
        .listIdeaByField(
          this.tokensave,
          this.cont * 4,
          this.orderView,
          this.fieldView
        )
        .subscribe(
          (res: any) => {
            this.arrayPublicIdeas = res.data.value;
            this.swalServ.loading(250);
          },
          (error) => {
            this.swalServ.checkError(error.status);
          }
        );
    }
  }

  // HERE
  getIdeasPublics() {
    this.service
      .listPublicIdea(this.tokensave, this.cont * 4, this.orderView)
      .subscribe(
        (res: any) => {
          this.arrayPublicIdeas = res.data.value;
        },
        (error) => {
          this.swalServ.checkError(error.status);
        }
      );
  }


  ideasFilter(type) {
    switch (type) {
      case 'asc':
        this.orderView = 'asc';
        this.fieldView = '';
        this.callServiceOrder(this.orderView, '');
        break;
      case 'desc':
        this.orderView = 'desc';
        this.fieldView = '';
        this.callServiceOrder(this.orderView, '');
        break;
      case 'comment':
        this.fieldView = 'comment';
        this.callServiceOrder(this.orderView, this.fieldView);
        break;
      case 'likes':
        this.fieldView = 'likes';
        this.callServiceOrder(this.orderView, this.fieldView);
        break;
      case 'dislikes':
        this.fieldView = 'dislikes';
        this.callServiceOrder(this.orderView, this.fieldView);
        break;

      default:
        break;
    }
  }

  showIdea(idea, template) {
    this.swalServ.searching();
    this.formSubmitted = false;
    this.ideaIdSelect = idea._id;
    this.resetForms();

    this.modalComment = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
    this.getCommentsComplete(this.ideaIdSelect);
  }

  publicIdea(): void {
    this.formSubmitted = true;
    this.formComments.get('ideaId')?.setValue(this.ideaIdSelect);

    this.formComments.patchValue({
      comment: this.formComments.value.comment.trim(),
    });

    if (this.formComments.invalid) {
      this.swalServ.error('Comentario inválido');
    } else {
      this.service
        .commentIdea(this.tokensave, this.formComments.value)
        .subscribe(
          (res) => {
            this.swalServ.confirmation('Comentario publicado');
            this.getCommentsComplete(this.ideaIdSelect);
            this.getIdeasPublics();
            this.resetForms();
            this.orderView = '';
            this.fieldView = '';
          },
          (error) => {
            this.swalServ.error(error.error.data.error.details[0].message);
          }
        );
    }
  }

  // *Sección de validaciones*
  getErrorMessage(field: string): string {
    return this.validateService.getErrorMessage(field, this.formComments);
  }

  // Validador de campos
  invalidField(field: string): boolean {
    return this.validateService.invalidField(
      field,
      this.formComments,
      this.formSubmitted
    );
  }

  getCommentsComplete(idea): void {
    this.ideaView = {
      idea_anexos: [],
    };
    const ideaObject = {
      ideaId: idea,
    };

    this.service.getMyReactionIdea(this.tokensave, this.ideaIdSelect).subscribe(
      (res: any) => {
        if (res.data.reactionIdea) {
          this.myReaction = res.data.typeReactionId.code;
        } else {
          this.myReaction = '';
        }
      },
      (error) => {
        this.swalServ.checkError(error.status);
      }
    );

    this.service.getSpecificIdea(this.tokensave, ideaObject).subscribe(
      (res: any) => {
        this.ideaView = res.data.value[0];
        this.swalServ.close();
        if (this.ideaView.comment_idea_countUser.length !== 0) {
          const user = this.ideaView.comment_idea_countUser[0];

          this.topUser.name =
            user.user_most_comment[0].profile.name +
            ' ' +
            user.user_most_comment[0].profile.lastname;
          this.topUser.number = user.countCommentOfUser;
        } else {
          this.topUser.name = 'No hay registro';
          this.topUser.number = 0;
        }

        this.arrayComments = this.ideaView.comment_idea;
        this.totalItems = this.arrayComments.length * 10;
      },
      (error) => {
        this.swalServ.error(error);
      }
    );
  }

  resetForms(): void {
    this.formComments.patchValue({
      ideaId: '',
      commentTypeId: '',
      comment: '',
    });

    this.formSubmitted = false;
  }

  addReaction(opinion): void {
    let reaction;
    if (opinion === 'like') {
      reaction = this.listReactionType.filter((react) => react.code === 'like');
      this.formReaction.patchValue({
        ideaId: this.ideaIdSelect,
        typeReactionId: reaction[0]._id,
      });
      this.callServiceReacting(this.myReaction, 'like');
    } else {
      reaction = this.listReactionType.filter(
        (react) => react.code === 'dislike'
      );
      this.formReaction.patchValue({
        ideaId: this.ideaIdSelect,
        typeReactionId: reaction[0]._id,
      });
      this.callServiceReacting(this.myReaction, 'dislike');
    }
  }

  callServiceOrder(order, field) {
    if (field === '') {
      this.service
        .listPublicIdea(this.tokensave, this.cont * 4, order)
        .subscribe(
          (res: any) => {
            this.arrayPublicIdeas = res.data.value;
            this.swalServ.loading(250);
          },
          (error) => {
            this.swalServ.checkError(error.status);
          }
        );
    } else {
      this.service
        .listIdeaByField(this.tokensave, this.cont * 4, order, field)
        .subscribe(
          (res: any) => {
            this.arrayPublicIdeas = res.data.value;
            this.swalServ.loading(250);
          },
          (error) => {
            this.swalServ.checkError(error.status);
          }
        );
    }
  }

  callServiceReacting(opinionOld, opinionNew) {
    if (opinionOld === '') {
      this.service
        .createReactingIdeas(this.tokensave, this.formReaction.value)
        .subscribe(
          (res: any) => {
            this.getIdeasPublics();
            this.myReaction = opinionNew;
          },
          (error) => {}
        );
    } else {
      if (opinionOld === opinionNew) {
        this.formReaction.removeControl('typeReactionId');
        this.service
          .deleteReactingIdeas(this.tokensave, this.formReaction.value)
          .subscribe(
            (res: any) => {
              this.getIdeasPublics();
              this.myReaction = '';
              this.formReaction.addControl(
                'typeReactionId',
                new FormControl('')
              );
            },
            (error) => {}
          );
      } else {
        this.service
          .putReactingIdeas(this.tokensave, this.formReaction.value)
          .subscribe(
            (res: any) => {
              this.getIdeasPublics();
              this.myReaction = opinionNew;
            },
            (error) => {}
          );
      }
    }
  }
}
