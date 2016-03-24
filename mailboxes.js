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
                        ctrl.selectedMailbox.letters = [];
                        Object.keys(response.data).forEach(function (key) {
                            var letter = response.data[key];
                            letter.id = key;
                            ctrl.selectedMailbox.letters.push(letter);
                        });
                        console.log(ctrl.selectMailbox.letters);
                        if (!ctrl.selectedMailbox.letters) {
                            ctrl.selectedMailbox.letters = [];
                        }
                        if (ctrl.selectedMailbox.letters.length > 0) {
                            ctrl.selectedLetter = mailbox.letters[0]
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
            letter: '=',
            selectMailbox: '&'
        },
        templateUrl: 'letters.html',
        controller: function (LetterService) {
            var ctrl = this;
            ctrl.newLetter = {
                subject: 'Новое письмо',
                body: 'Здравствуйте',
                recipient: '',
                sender: 'my@email'
            };
            ctrl.selectLetter = function (letter) {
                ctrl.letter = letter;
            };
            ctrl.sendLetter = function () {
                LetterService.sendMessage(ctrl.mailbox, ctrl.newLetter).then(function (response) {
                    ctrl.selectMailbox({mailbox: ctrl.mailbox});
                })
            }
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

        this.sendMessage = function (mailbox, message) {
            return $http.post('https://vivid-inferno-9244.firebaseIO.com/letters/' + (mailbox.id - 1) + '/letters/.json', message);
        };

        this.editMessage = function (mailbox, message) {
            return $http.post('https://vivid-inferno-9244.firebaseIO.com/letters/' + (mailbox.id - 1) + '/letters/' + message.id + '.json', message);
        };
    });