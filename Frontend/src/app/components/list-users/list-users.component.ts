import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  students = [];
  studentsSubs = [{}];
  selectedCity1: string;
  deleteDialog = false;
  AddEditDialog = false;
  addEditForm: FormGroup;
  FormSubmitted = false;
  studentId = null;
  editForm = false;
  public userSearch: string;
  checked = true;
  userSearchUpdate = new Subject<string>();
  page = 1;
  perPage = 10;
  total = 0;
  search = '';
  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService) {
    this.addEditForm = fb.group({
      firstName: ['', [
        Validators.required
      ]],
      lastName: ['', [
        Validators.required
      ]],
      class: ['', [
        Validators.required
      ]],
      subjects: this.fb.array([]),
    });
    this.userSearchUpdate
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(value => {
        this.search = value;
        this.getStudents();
      });
  }
  ngOnInit() {
    this.getStudents();
    this.addSubjects();
  }
  getStudents() {
    this.apiService.getStudents({
      page: this.page,
      perPage: this.perPage,
      search: this.search
    }).subscribe(response => {
      if (response.status) {
        this.students = response?.data?.result;
        this.total = response?.data?.total;
      } else {
        this.toastr.success(response.message);
      }
    }, error => {
      this.toastr.success('Internal server Error,  ');
    });
  }
  subjects(): FormArray {
    return this.addEditForm.get('subjects') as FormArray;
  }
  paginateData(event) {
    this.page = event.page + 1;
    this.perPage = event.rows;
    this.getStudents();
  }
  newSubjects(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required
      ]],
      marks: ['', [
        Validators.required
      ]],
    });
  }

  addSubjects() {
    this.subjects().push(this.newSubjects());
  }

  removeSubject(i: number) {
    this.subjects().removeAt(i);
  }

  deleteStudent(student) {
    this.deleteDialog = true;
    this.studentId = student._id;
  }
  deleteStudentAccept() {
    this.apiService.removeStudents(this.studentId)
      .subscribe(response => {
        if (response.status) {
          this.getStudents();
          this.deleteDialog = false;
          this.toastr.success(response.message);
        } else {
          this.toastr.success(response.message);
        }
      }, error => {
        this.toastr.success('Internal server Error, try again');
      });
  }
  editStudent(student) {
    this.studentId = student._id;
    this.editForm = true;
    this.AddEditDialog = true;
    this.subjects().controls = [];
    student.subjects.forEach(ele => {
      this.addSubjects();
    });
    this.addEditForm.patchValue(student);
  }
  add() {
    this.studentId = null;
    this.editForm = false;
    this.addEditForm.reset();
    this.addEditForm.clearValidators();
    this.AddEditDialog = true;
  }
  onSubmit() {
    this.FormSubmitted = true;
    if (!this.addEditForm.valid) {
      this.FormSubmitted = false;
      return;
    } else {
      if (!this.editForm) {
        this.apiService.addStudents(this.addEditForm.value)
          .subscribe(response => {
            if (response.status) {
              this.AddEditDialog = false;
              this.getStudents();
              this.toastr.success(response.message);
            } else {
              this.toastr.success(response.message);
            }
          }, error => {
            this.toastr.success('Internal server Error, try again');
          });
      } else {
        this.apiService.editStudents(Object.assign(this.addEditForm.value, { _id: this.studentId }))
          .subscribe(response => {
            if (response.status) {
              this.AddEditDialog = false;
              this.getStudents();
              this.toastr.success(response.message);
            } else {
              this.toastr.success(response.message);
            }
          }, error => {
            this.toastr.success('Internal server Error, try again');
          });
      }
    }
  }

}
