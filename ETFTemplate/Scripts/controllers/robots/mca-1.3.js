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
        rsk = answer('QDRW').Code; // code en cas de baisse des marchés

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

    // return the equities model
    var equities = function (w) {

        var esri = 'b9c32ba8-fc2e-41e4-a31e-6681bc8e5859', // world sri equities
            ewld = '01a334b4-0f9f-4601-882c-554a61939429'; // world equities

        var assets = [];

        if (sri == 0)
            assets.push({ SecurityID: ewld, Weight: w });
        else {
            assets.push({ SecurityID: esri, Weight: w*0.3 });
            assets.push({ SecurityID: ewld, Weight: w*0.7 });
        }

        return assets;

    }

    // retourne le modele fixed incomes
    var fixedincomes = function (w) {
        var assets = [];
        assets.push({ SecurityID: 'd5493ad0-d895-4644-9dbb-38305edbf520', Weight: w })
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
    alloc.BenchmarkID = 3349;

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
