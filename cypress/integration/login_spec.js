describe('Testing', () => {
  it('Login', () => {
    cy.visit('/');
    // ждём загрузки
    cy.wait(4000);
  });
  it('Add task', () => {
    //нажимаем добавить таску
    cy.get('.app__add-button').click();
    // вводим название и проверяем значение инпута
    cy.get('.app__add-task input')
      .type('task999')
      .should('have.value', 'task999');
    // добавляем
    cy.get('.app__add-task button:first-of-type').click();
    // проверяем добавилась ли таска
    cy.get('.todo');
    cy.get('.todo:first-child span')
      .contains('task999');
  });
  it('Change task', () => {
    // изменяем значение этой таски
    cy.get('.todo:first-child .todo__button--edit').click();

    cy.get('.todo:first-child input')
      .click()
      .type('99')
      .should('have.value', 'task99999');

    cy.get('.todo:first-child .todo__button--edit').click();
    // проверяем полученное значение
    cy.get('.todo');
    cy.get('.todo:first-child span')
      .contains('task99999');
  });
  it('Complete task', () => {
    // отмечаем как завершенная и проверяем
    cy.get('.todo:first-child .todo__button--green').click();

    cy.get('.todo.todo__completed');
  });
  it('Delete task', () => {
    // удаляем элемент и проверяем удаление
    cy.get('.todo__completed').first().within(()=>{
      cy.get('.todo__button--red').click()
    });

    cy.get('task99999').should('not.exist')
  });
});