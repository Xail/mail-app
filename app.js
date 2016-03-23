angular.module('emailApp', [])
    .component('mailboxes', {
        templateUrl: 'mailboxes.html',
        controller: function (MailboxService, LetterService) {
            var ctrl = this;
            this.activeEmail = '';
            this.activeLetter = {};
            this.mailboxes = [];
            MailboxService.getAll().then(function (response) {
                ctrl.mailboxes = response.data;
            });
            this.selectMailbox = function (mailbox) {
                this.selectedMailbox = mailbox;

                LetterService.getLetters(this.selectedMailbox)
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
            this.selectLetter = function (letter) {
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
            return $http.get('https://vivid-inferno-9244.firebaseIO.com/.json');
        };
    })
    .service('LetterService', function ($http) {
        this.getLetters = function (mailbox) {
            return $http.get('https://vivid-inferno-9244.firebaseIO.com/' + (mailbox.id - 1) + '/letters/.json');
        };
    });