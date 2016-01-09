
var Bots =
[
    { Name : "Naive",
        Commands : [
            ["attacker.getMana() == 0",
            [Spell.ENHANCE, 
	    Spell.GATHER, 
	    Spell.HEAL, 
	    Spell.HEX,
            Spell.SHIELD]],
            ["attacker.getMana() == 1",
            [Spell.COUNTER, 
	    Spell.DAMAGE, 
	    Spell.ENHANCE, 
	    Spell.GATHER,
            Spell.HEAL, 
	    Spell.HEX,
	    Spell.SHIELD, 
	    Spell.SUMMON]],
            ["attacker.getMana() > 1",
            [Spell.COUNTER, 
	    Spell.DAMAGE, 
	    Spell.ENHANCE, 
	    Spell.GATHER,
            Spell.HEAL, 
	    Spell.HEX, 
	    Spell.REFLECT, 
	    Spell.SHIELD,
            Spell.SUMMON]]
        ]
    },
    { Name : "Random",
        Commands : [
	    ["true",
	    [Spell.COUNTER,
	    Spell.DAMAGE,
	    Spell.ENHANCE,
	    Spell.GATHER,
	    Spell.HEAL,
	    Spell.HEX,
	    Spell.REFLECT,
	    Spell.SHIELD,
	    Spell.SUMMON]]
	]
    },
    { Name : "FireBolter",
	Commands : [
	    ["attacker.getMana() == 0",
	    [Spell.GATHER,
	    Spell.SHIELD]],
	    ["true",
	    [Spell.GATHER,
	    Spell.SHIELD,
	    Spell.DAMAGE]]
	]
    },
    { Name : "Summoner",
	Commands : [
	    ["attacker.getMana() == 0",
	    [Spell.GATHER,
	    Spell.SHIELD]],
	    ["true",
	    [Spell.GATHER,
	    Spell.SHIELD,
	    Spell.SUMMON]]
	]
    },
    { Name : "Counter Summoner",
        Commands : [
            ["attacker.getMana() == 0",
            [Spell.GATHER]],
            ["attacker.getMana() == 1 && defender.getMana() > 0",
            [Spell.GATHER,
            Spell.COUNTER]],
            ["attacker.getMana() == 1",
            [Spell.GATHER,
            Spell.SUMMON]],
            ["attacker.getMana() > 1 && defender.getMana() > 0",
            [Spell.GATHER,
            Spell.REFLECT]],
            ["true",
            [Spell.GATHER,
            Spell.SUMMON]]
        ]
    },
    { Name : "Counter Firebolter",
        Commands : [
            ["attacker.getMana() == 0",
            [Spell.GATHER]],
            ["attacker.getMana() == 1 && defender.getMana() > 0",
            [Spell.GATHER,
            Spell.COUNTER]],
            ["attacker.getMana() == 1",
            [Spell.GATHER,
            Spell.DAMAGE]],
            ["attacker.getMana() > 1 && defender.getMana() > 0",
            [Spell.GATHER,
            Spell.REFLECT]],
            ["true",
            [Spell.GATHER,
            Spell.DAMAGE]]
        ]
    },
    { Name : "Turtler",
        Commands : [
            ["attacker.getMana() == 0",
            [Spell.GATHER]],
            ["defender.getMana() > 0",
            [Spell.SHIELD]],
            ["attacker.getMana() < 3",
            [Spell.GATHER]],
            ["true",
            [Spell.ENHANCE,
            Spell.DAMAGE,
            Spell.SUMMON]]
        ]
    },
    { Name : "Hexer",
        Commands : [
            ["attacker.getMana() == 0",
             [Spell.GATHER]],
            ["attacker.getMana() < 3 && attacker.Monster == null",
             [Spell.GATHER,
              Spell.SHIELD]],
            ["attacker.getMana() < 3 && attacker.Monster",
             [Spell.GATHER,
              Spell.HEX]],
            ["attacker.getMana() > 2 && attacker.empowered && attacker.Monster == null",
             [Spell.SUMMON]],
            ["attacker.getMana() > 2 && defender.isHexed()",
             [Spell.DAMAGE]],
            ["attacker.getMana() > 2 && attacker.Monster == null",
             [Spell.HEX,
              Spell.ENHANCE]],
            ["attacker.getMana() > 2 && attacker.Monster",
             [Spell.HEX]],
            ["true",
             [Spell.HEAL]]
        ]
    },
    { Name : "FireBomber",
        Commands : [
            ["attacker.getMana() < 3",
             [Spell.GATHER]],
            ["attacker.empowered && defender.isHexed()",
             [Spell.DAMAGE]],
            ["attacker.empowered",
             [Spell.HEX]],
            ["true",
             [Spell.ENHANCE]]
        ]
    }
]

function getBotCommand(attacker, defender, bot)
{
    for (var command in bot.Commands) {
        command = bot.Commands[command];
        if (eval(command[0])) {
            len = command[1].length;
            if (len > 1) {
                choice = Math.floor((len) * Math.random());
                return command[1][choice];
            }
            else {
                return command[1][0];
            }
        }
    }
}

function getHumanCommand(lefthand, righthand)
{
    if (lefthand == "Red" && righthand == "Red")
    {
        return Spell.DAMAGE;
    }
    else if (lefthand == "Red" && righthand == "Blue")
    {
        return Spell.SHIELD;
    }
    else if (lefthand == "Red" && righthand == "Green")
    {
        return Spell.GATHER;
    }
    else if (lefthand == "Green" && righthand == "Red")
    {
        return Spell.ENHANCE;
    }
    else if (lefthand == "Green" && righthand == "Green")
    {
        return Spell.SUMMON;
    }
    else if (lefthand == "Green" && righthand == "Blue")
    {
        return Spell.HEAL;
    }
    else if (lefthand == "Blue" && righthand == "Blue")
    {
        return Spell.COUNTER;
    }
    else if (lefthand == "Blue" && righthand == "Green")
    {
        return Spell.HEX;
    }
    else if (lefthand == "Blue" && righthand == "Red")
    {
        return Spell.REFLECT;
    }
}