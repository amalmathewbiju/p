import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.scss'
})
export class DeleteConfirmationComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>
  ){}

  onAbortClick(){
    this.dialogRef.close(false);
  }

  onExecuteClick(){
    this.dialogRef.close(true)
  }

}
