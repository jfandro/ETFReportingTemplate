// Management fees
LoyolApp.Settings.ManagementFees = LoyolApp.Settings.ManagementFees || {};
LoyolApp.Settings.ManagementFees.rate = 0;
LoyolApp.Settings.ManagementFees.period = 0;
LoyolApp.Settings.ManagementFees.basis = 365;

// Questionnaire kyc
LoyolApp.Settings.questionnaire = 0;

/**
 * Local script to create allocations
 * @param {any} robo 
 * @param {any} valuedate
 * @param {any} answers
 * @param {any} callback
 */

var myReadAnswers = function (robo, valuedate, answers, callback) {

    // retourne la réponse unique donnée à la question portant un code
    var answer = function (code) {
        var q = answers.find(e => e.Code == code);
        return q == null ? null : q.Answers[0];
    }

    // retourne les réponses données à la question portant un code
    var manswers = function (code) {
        var q = answers.find(e => e.Code == code);
        return q == null ? 0 : q.Answers;
    }

    // retourne les réponses aux questions suivantes
    var sri = answer('QESG').Rank, // le niveau de sensibilité esg
        age = answer('QAGE').Rank, // la tranche d'ages
        exp = answer('QEXP').Rank, // le niveau d'expériences
        cry = answer('QCRY') != null ? answer('QCRY').Value : 1, // 0, 5 ou 10% sur les cryptos
        rsk = answer('QDRW').Code, // code en cas de baisse des marchés
        thm = manswers('QTHM'); // codes des thématiques retenues

    var mm1 = answer('QMO1') != null ? answer('QMO1').Value : 1, // 0, 5 ou 10% sur le momentun sectoriel
        mm2 = answer('QMO2') != null ? answer('QMO2').Value : 1;

        // montant initial investi
    var init = function (ratio) {
        var apports = answer('QAPP');
        if (apports == null)
            return 100 * ratio;
        return 10 * parseInt(apports.Code.replace('K', '')) * ratio;
    }

    // return a frequency code for programs
    var frequency = function () {
        var a = answer('QFRQ');
        if (a == null || a.Code == 'Z')
            return '';
        return a.Code;
    }

    // regular invested amount
    var regular = function (ratio) {
        var apports = answer('QREG');
        if (apports == null)
            return 0;
        return ratio * apports.MaxValue / 100; // we consider the max value as the contribution
    }

    // invested amount
    var amount = function (ratio) {
        return (frequency() == '' || frequency() == 'Z') ? init(ratio) : regular(ratio);
    }

    // return an investment of one security with a given weight 
    var item = function (securityid, weight) {
        return {
            SecurityID: securityid,
            Value: amount(weight),
            ValueDate: valuedate,
            Status: 'INV',
            Units: 'M',
            Ccy: 'EUR',
            ProgramCode: frequency()
        };
    }

    // retourne la correspondance avec le modèle thématique
    var mythematics = function (key) {

        switch (key) {

            case "TEC":
                return '7f410c5d-1517-4da1-96d5-cae9e58e68d6';
                break;

            case "SMT":
                return '4124fe36-68f4-448b-96c2-4773ab662875';
                break;

            case "ENG":
                return '286f6b20-3ebf-46dd-a507-abd8291551a4';
                break;

            case "RUS":
                return '8e797049-c05d-46a7-88b7-f81a5dca5424';
                break;

            default:
                return '77a07a53-140c-4ef6-83d5-632593aee7d4';
        }
    }

    // return the equities model
    var equities = function (w) {

        var esri = 'b9c32ba8-fc2e-41e4-a31e-6681bc8e5859', // world isr
            ewld = '7f3234ca-22ed-4747-b5fd-27d85d0971d8', // world equities pea
            eesg = '77a07a53-140c-4ef6-83d5-632593aee7d4'; // selected thema

        var emm2 = 'd6b3be6a-681a-4cb6-b812-5d081849c20a', // momentum geo
            emm1 = 'f3f60571-19ef-432b-a682-bc2364d681d1'; // momentum sectoriel

        var assets = [];

        if (mm1 > 1) {
            assets.push({ SecurityID: emm1, Weight: mm1 });
            w -= mm1;
        }

        if (mm2 > 1) {
            assets.push({ SecurityID: emm2, Weight: mm2 });
            w -= mm2;
        }

        // Is the robo under sustainability
        robo.sustainability = sri > 0;

        if (sri == 0)
            assets.push({ SecurityID: ewld, Weight: w });

        if (sri == 1)
            assets.push({ SecurityID: esri, Weight: w });

        if (sri == 2) {
            var k = thm.length;
            if (k == 0)
                assets.push({ SecurityID: esri, Weight: w }); // no thematic
            else {
                assets.push({ SecurityID: esri, Weight: w/2 }); // no thematic
                thm.forEach(function (t) {
                    assets.push({ SecurityID: mythematics(t.Code), Weight: w / (2*k) });
                })
            }
        }

        return assets;
    }
    
    // retourne le modele fixed incomes
    var fixedincomes = function (w) {
        var assets = [];
        var m1 = 'p-a7e90f06-5480-4a7d-b35e-a199ee59184b',
            m2 = 'e481a272-50ac-476c-a260-bc763ac166fc';

        var m = sri == 0 ? m2 : m1;

        assets.push({ SecurityID: m1, Weight: w })
        return assets;
    }

    // retourne le modele cryptos
    var cryptos = function (w) {
        var assets = [];
        assets.push({ SecurityID: 'ebf9f8ab-ee45-4542-acd7-5171bd132a8a', Weight: w })
        return assets;
    }

    // fonction qui détermine la meilleure allocation profilée en fonction de l'age et de l'expérience
    var riskallocation = function (wa, wb) {

        wc = 0;

        // si l'expérience est forte, on augmente de 5% la partie risquée
        if (exp > 1) {
            wa += 5;
            wb -= 5;
        }

        // si +40 ans on baisse de 7% la partie risquée
        if (age > 1) {
            wa -= 7;
            wb += 7;
        }

        // si comprends et adopte les cryptos 
        if (cry > 1) {
            wa -= cry;
            wc += cry;
        }

        // poche actions
        equities(wa).forEach(function (x) {
            alloc.Records.push(item(x.SecurityID, x.Weight));
        });

        // poche obligation
        fixedincomes(wb).forEach(function (x) {
            alloc.Records.push(item(x.SecurityID, x.Weight));
        });

        // poche crypto
        if (wc > 0) {
            cryptos(wc).forEach(function (x) {
                alloc.Records.push(item(x.SecurityID, x.Weight));
            });
        }
    }

    // creation of one allocation
    alloc = new myAllocation(robo.code, valuedate);

    // Important here we fix the fees rule
    alloc.ManagementFeesRate = LoyolApp.Settings.ManagementFees.rate / 100;
    alloc.ManagementFeesPeriod = LoyolApp.Settings.ManagementFees.period;
    //alloc.BenchmarkID = 3349;

    // suivant le risque
    switch (rsk) {

        case 'SAL': // profil prudent
            riskallocation(40, 60);
            break;

        case 'WAI': // profil equilibré
            riskallocation(60, 40);
            break;

        case 'INV': // profil agressif
            riskallocation(90, 10);
            break;

        default: // profil audacieux
            riskallocation(80, 20);
            break;

    }

    // retourne l'allocation dans le callback
    callback(alloc);

};
