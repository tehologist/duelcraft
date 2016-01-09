$(document).ready(function() {
    var opts = "";
    $("#next").attr("enabled", "");
    $("#next").attr("disabled", "disabled");
    for (var bot in Bots) {
        opts += "<option value=\"" + bot + "\">" + Bots[bot].Name + "</option>";
    }
    $("#player1").html(opts);
    $("#player2").html(opts);
    var wiz1new = null;
    var wiz2new = null;
    var mybot = null;
    var mybot2 = null;
    var game = null;
    $("#start").click(function() {

        $("#next").attr("enabled", "");
        $("#next").attr("disabled", "disabled");
        $("#battleMessage").html("");

        if ($("#isHuman")[0].checked) {
            wiz1new = new Wizard();
            wiz1new.Wizard("Human");
        }
        else {
            mybot = Bots[$("#player1 option:selected").val()];
            wiz1new = new Wizard();
            wiz1new.Wizard(mybot.Name);
        }

        mybot2 = Bots[$("#player2 option:selected").val()];
        wiz2new = new Wizard();
        if (mybot) {
            if (mybot.Name == mybot2.Name) {
                wiz2new.Wizard(mybot2.Name + "2");
            }
            else {
                wiz2new.Wizard(mybot2.Name);
            }
        }
        else {
            wiz2new.Wizard(mybot2.Name);
        }
        

        game = new GameEngine();
        game.evtGameStart = function(wizone, wiztwo) {
            data = "------------------------------------------" + endLine;
            data += "Start Match" + endLine;
            data += "------------------------------------------" + endLine;
            data += wizone.getWizardName() + " Health: " + wizone.getHitPoints() +
            " Mana: " + wizone.getMana() + endLine;
            data += wiztwo.getWizardName() + " Health: " + wiztwo.getHitPoints() +
            " Mana: " + wiztwo.getMana() + endLine;
            $("#battleMessage").append(data);
        }
        game.evtRoundStart = function(turn) {
            data = "------------------------------------------" + endLine;
            data += "Round " + turn.toString() + endLine;
            data += "------------------------------------------" + endLine;
            $("#battleMessage").append(data);
        }
        game.evtRoundEnd = function(wizone, wiztwo, turn) {
            data = wizone.getWizardName() + " Health: " + wizone.getHitPoints() +
            " Mana: " + wizone.getMana() + endLine;
            data += wiztwo.getWizardName() + " Health: " + wiztwo.getHitPoints() +
            " Mana: " + wiztwo.getMana() + endLine;
            if (wizone.getHitPoints() == 0) {
                data += wizone.getWizardName() + " dies." + endLine;
            }
            if (wiztwo.getHitPoints() == 0) {
                data += wiztwo.getWizardName() + " dies." + endLine;
            }
            $("#battleMessage").append(data);
            if (wizone.getHitPoints() == 0 || wiztwo.getHitPoints() == 0) {
                return true;
            }
            else if (turn > 50) {
                data = "Match laster over 50 turns, draw." + endLine;
                $("#battleMessage").append(data);
                return true;
            }
            else if (wizone.getHitPoints() == 0 && wiztwo.getHitPoints() == 0) {
                data = "Both wizards died, draw." + endLine;
                $("#battleMessage").append(data);
                return true;
            }
            else {
                return false;
            }
        }
        game.evtGatherMana = function(user) {
            data = user.getWizardName() + " draws magical energy into his being." +
            endLine;
            $("#battleMessage").append(data);
        }
        game.evtCastReflect = function(user, success) {
            if (success) {
                data = user.getWizardName() + " spreads his hands as a mirror \
                in front of him." + endLine;
                $("#battleMessage").append(data);
            }
            else {
                data = user.getWizardName() + " attempts to form a mirror, only to \
               have it shatter." + endLine;
                $("#battleMessage").append(data);
            }
        }
        game.evtCastCounter = function(user, success) {
            if (success) {
                data = user.getWizardName() + " casts counter spell." + endLine;
                $("#battleMessage").append(data);
            }
            else {
                data = user.getWizardName() + " attempts to counter spell but \
                but fails." + endLine;
                $("#battleMessage").append(data);
            }
        }
        game.evtCastShield = function(attacker, defender) {
            if (attacker.isHexed()) {
                data = attacker.getWizardName() + " attempts to cast shield, \
                however the hex prevents it." + endLine;
                $("#battleMessage").append(data);
            }
            else if (defender.reflectFlag) {
                if (attacker.empowered) {
                    data = attacker.getWizardName() + " spell fires powerfully, \
                   shielding opponent." + endLine;
                    $("#battleMessage").append(data);
                }
                else if (defender.isShielded()) {
                    data = attacker.getWizardName() + " attempts to summon forth \
                    shield only to find his spell countered." + endLine;
                    $("#battleMessage").append(data);
                }
                else {
                    data = attacker.getWizardName() + " attempts to shield \
                    himself, only to find his spell backfire, shielding \
                    his opponent." + endLine;
                    $("#battleMessage").append(data);
                }
            }
            else if (defender.counterFlag) {
                data = attacker.getWizardName() + " attempts to summon forth \
                shield only to find his spell countered." + endLine;
                $("#battleMessage").append(data);
            }
            else if (attacker.empowered) {
                data = attacker.getWizardName() + " summons forth an empowered \
                shield shield of protection." + endLine;
                $("#battleMessage").append(data);
            }
            else {
                data = attacker.getWizardName() + " summons forth a shield of \
                protection." + endLine;
                $("#battleMessage").append(data);
            }
        }
        game.evtCastHeal = function(attacker, defender) {
            if (defender.counterFlag) {
                data = attacker.getWizardName() + " attempts to heal, only to be \
                countered." + endLine;
                $("#battleMessage").append(data);
            }
            else if (defender.reflectFlag) {
                if (attacker.empowered) {
                    if (defender.isHexed()) {
                        data = attacker.getWizardName() + " casts healing spell \
                        with awesome might, only to have it reflected at his \
                        opponent." + endLine;
                        $("#battleMessage").append(data);
                    }
                    else {
                        data = attacker.getWizardName() + " casts healing spell \
                        with godly might, only to have it reflected back at \
                        his opponent." + endLine;
                        $("#battleMessage").append(data);
                    }
                }
                else {
                    data = attacker.getWizardName() + " casts healing spell only \
                    to have it reflected at his opponent." + endLine;
                    $("#battleMessage").append(data);
                }
            }
            else {
                if (attacker.empowered) {
                    if (attacker.isHexed()) {
                        data = attacker.getWizardName() + " casts healing spell \
                        with awesome might." + endLine;
                        $("#battleMessage").append(data);
                    }
                    else {
                        data = attacker.getWizardName() + " casts healing spell \
                        with godly might." + endLine;
                        $("#battleMessage").append(data);
                    }
                }
                else {
                    data = attacker.getWizardName() + " casts healing spell." +
                    endLine;
                    $("#battleMessage").append(data);
                }
            }
        }
        game.evtSummonMonster = function(attacker, defender) {
            data = "";
            if (defender.counterFlag) {
                data += attacker.getWizardName() + " attempts to summon forth a monster, only \
                to have his spell countered." + endLine;
                $("#battleMessage").append(data);
            }
            else if (defender.reflectFlag && defender.Monster) {
                data += attacker.getWizardName() + " summons " + defender.Monster.getMonsterName() +
                " which turns on its summoner." + endLine;
                $("#battleMessage").append(data);
            }
            else {
                if (attacker.Monster == null) {
                    data += attacker.getWizardName() + " tries to summon forth monster but \
                    fails from fatigue." + endLine;
                    $("#battleMessage").append(data);
                }
                else {
                    data += attacker.getWizardName() + " summons forth a " + attacker.Monster.getMonsterName() +
                    "." + endLine;
                    $("#battleMessage").append(data);
                }
            }
        }
        game.evtDamageMonster = function(attacker, defender, spell, killed) {
            data = "";
            if (spell == Spell.DAMAGE) {
                if (killed) {
                    data = attacker.getWizardName() + "\'s firebolt slams into " + defender.getWizardName() +
                 "'s " + defender.Monster.getMonsterName() + ", incinerating it." + endLine;

                }
                else {
                    data = attacker.getWizardName() + "\'s firebolt slams into " + defender.getWizardName() +
                 "'s " + defender.Monster.getMonsterName() + ", injuring it." + endLine;
                }
            }
            else {
                if (killed) {
                    data = attacker.getWizardName() + "\'s " + attacker.Monster.getMonsterName() +
                    " dies in battle." + endLine;
                }
                else {
                    data = attacker.getWizardName() + "\'s " + attacker.Monster.getMonsterName() +
                    " is injured but lives to fight another day." + endLine;
                }

            }
            $("#battleMessage").append(data);
        }
        game.evtDamageWizard = function(attacker, defender, spell) {
            data = "";
            if (spell == Spell.DAMAGE) {
                if (defender.isShielded()) {
                    data = attacker.getWizardName() + "\'s firebolt slams harmlessly into " +
            defender.getWizardName() + "\'s shield." + endLine;
                }
                else {
                    data = attacker.getWizardName() + "\'s firebolt slams into " +
                defender.getWizardName() + " burning him badly." + endLine;
                }
            }
            else {
                if (defender.isShielded()) {
                    data = attacker.getWizardName() + "\'s " + attacker.Monster.getMonsterName() +
                " attacks " + defender.getWizardName() + " however, attacks slam harmless against " +
                defender.getWizardName() + "\'s shield." + endLine;
                }
                else {
                    data = attacker.getWizardName() + "\'s " + attacker.Monster.getMonsterName() +
                " attacks " + defender.getWizardName() + "," + defender.getWizardName() +
                " cries out in pain." + endLine;
                }
            }
            $("#battleMessage").append(data);
        }
        game.evtDamageFail = function(attacker, defender, spell) {
            data = "";
            switch (spell) {
                case Spell.NONE:
                    data = attacker.getWizardName() + " hand's flare red and then fizzles." + endLine;
                    break;
                case Spell.COUNTER:
                    data = attacker.getWizardName() + "\'s spell fizzles as " + defender.getWizardName() +
                    " gestures towards him." + endLine;
                    break;
                case Spell.REFLECT:
                    data = attacker.getWizardName() + "\'s firebolt slams into " + defender.getWizardName() +
                    ", only to be reflected back at " + attacker.getWizardName() + "." + endLine;
                    break;
            }
            $("#battleMessage").append(data);
        }
        game.evtWeakenMonster = function(user, dead) {
            data = "";
            if (dead) {
                data = user.getWizardName() + "\'s " + user.Monster.getMonsterName() +
                "goes back from wence it came." + endLine;
            }
            else {
                data = user.getWizardName() + "\'s " + user.Monster.getMonsterName() +
                " begins to weaken." + endLine;
            }
            $("#battleMessage").append(data);
        }
        game.evtTryCombat = function(attacker, defender) {
            data = "";
            data = attacker.getWizardName() + "\'s " + attacker.Monster.getMonsterName() +
            " attacks " + defender.getWizardName() + "\'s " + defender.Monster.getMonsterName() +
            "." + endLine;
            $("#battleMessage").append(data);
        }
        game.evtCastHex = function(attacker, defender) {
            data = "";
            if (defender.counterFlag) {
                data = attacker.getWizardName() + " attempts to hex "
                    + defender.getWizardName() + ", but spell is swiftly \
                    countered." + endLine;
            }
            else if (defender.reflectFlag) {
                if (attacker.empowered) {
                    data = attacker.getWizardName() + "\'s empowered \
                    hex is reflected back up themself." + endLine;
                }
                else {
                    data = attacker.getWizardName() + " hex is \
                        reflected back upon themself." + endLine;
                }

            }
            else {
                if (attacker.empowered) {
                    data = attacker.getWizardName() + " hexes the \
                        opponent mightily." + endLine;
                }
                else {
                    data = attacker.getWizardName() + " hexes the \
                        opponent." + endLine;
                }
            }
            $("#battleMessage").append(data);
        }
        game.evtEnhance = function(attacker, defender) {
            data = attacker.getWizardName() + " glows white as he \
                becomes empowered." + endLine;
            $("#battleMessage").append(data);
        }
        game.GameEngine(wiz1new, wiz2new);
        if ($("#isHuman")[0].checked) {
            $("#next").attr("enabled", "enabled");
            $("#next").attr("disabled", "");
        }
        else {
            while (!game.next(getBotCommand(wiz1new, wiz2new, mybot),
            getBotCommand(wiz2new, wiz1new, mybot2)));
        }

    });
    $("#next").click(function() {
        if (game.next(
                    getHumanCommand(
                        $("input[@name='LeftHand']:checked").val(), $("input[@name='RightHand']:checked").val()),
                    getBotCommand(wiz2new, wiz1new, mybot2))) {
            $("#next").attr("enabled", "");
            $("#next").attr("disabled", "disabled");
        }
    });
});