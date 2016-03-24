angular.module('mailboxes', ['ui.bootstrap'])
    .component('mailboxes', {
        templateUrl: 'mailboxes.html',
        controller: function (MailboxService, LetterService) {
            var ctrl = this;
            ctrl.activeEmail = '';
            ctrl.activeLetter = {};
            ctrl.mailboxes = [];

            MailboxService.getAll().then(function (response) {
                ctrl.mailboxes = response.data;

                if (!ctrl.activeEmail) {
                    ctrl.selectMailbox(ctrl.mailboxes[0]);
                }
            });
            ctrl.selectMailbox = function (mailbox) {
                ctrl.selectedMailbox = mailbox;

                LetterService.getLetters(ctrl.selectedMailbox)
                    .then(function (response) {
                        ctrl.selectedMailbox.letters = response.data;
                        if (!ctrl.selectedMailbox.letters) {
                            ctrl.selectedMailbox.letters = [];
                        }
                        if (ctrl.selectedMailbox.letters.length > 0) {
                            ctrl.selectedLetter = mailbox.letters[0];
                        } else {
                            ctrl.selectedLetter = null;
                        }
                    });
            };
        }
    })
    .component('letters', {
        bindings: {
            mailbox: '<',
            letter: '='
        },
        templateUrl: 'letters.html',
        controller: function () {
            var ctrl = this;
            ctrl.selectLetter = function (letter) {
                ctrl.letter = letter;
            };
        }
    })
    .component('preview', {
        templateUrl: 'preview.html',
        bindings: {
            letter: '<'
        }
    })
    .service('MailboxService', function ($http) {
        this.getAll = function () {
            return $http.get('https://vivid-inferno-9244.firebaseIO.com/letters.json');
        };

    })
    .service('LetterService', function ($http) {
        this.getLetters = function (mailbox) {
            return $http.get('https://vivid-inferno-9244.firebaseIO.com/letters/' + (mailbox.id - 1) + '/letters/.json');
        };

        this.addMessage = function (mailbox, message) {
            return $http.post('https://vivid-inferno-9244.firebaseIO.com/letters/' + (mailbox.id - 1) + '/letters/.json', message);
        };

        this.editMessage = function (mailbox, message) {
            return $http.post('https://vivid-inferno-9244.firebaseIO.com/letters/' + (mailbox.id - 1) + '/letters/' + message.id + '.json', message);
        };
    });