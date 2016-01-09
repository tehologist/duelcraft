
    
var endLine = "<br>";

function Monster()
{
    var _level;
    var _hitPoints;
    this.Monster = Monster;
    this.getHitPoints = getHitPoints;
    this.getMonsterName = getMonsterName;
    this.getLevel = getLevel;
    this.gainHP = gainHP;
    this.loseHP = loseHP;
    
    function Monster(mylevel)
    {
        this._level = mylevel;
        this._hitPoints = mylevel;
    }
    
    function getMonsterName()
    {
        switch (this._level)
        {
            case 1:
                return "Goblin";
            case 2:
                return "Ogre";
            case 4:
                return "Balrog";
        }
        return null;
    }
    
    function getLevel()
    {
        return this._level;
    }
    
    function getHitPoints()
    {
        return this._hitPoints;
    }
    
    function gainHP(val)
    {
        this._hitPoints =
            this._hitPoints + val > this._level ?
            this._level :
            this._hitPoints + val;
    }
    
    function loseHP(val)
    {
        this._hitPoints =
            this._hitPoints - val < 0 ?
            0 :
            this._hitPoints - val;
    }
}

var Spell =
{
    NONE : 0,
    GATHER : 1,
    DAMAGE : 2,
    SHIELD : 3,
    SUMMON : 4,
    HEAL : 5,
    ENHANCE : 6,
    REFLECT : 7,
    HEX : 8,
    COUNTER : 9
}

function Wizard()
{
    var _hitPoints;
    var _mana;
    var _wizardName;
    this.currentCommand = Spell.NONE;
    this.getSpellName = getSpellName;
    this.getWizardName = getWizardName;
    this.empowered = false;
    this.counterFlag = false;
    this.reflectFlag = false;
    this.Monster = null;
    this.empoweredHex = 0;
    this.empoweredShield = 0;
    this.isHexed = isHexed;
    this.isShielded = isShielded;
    this.getHitPoints = getHitPoints;
    this.gainHP = gainHP;
    this.loseHP = loseHP;
    this.getMana = getMana;
    this.gainMana = gainMana;
    this.loseMana = loseMana;
    this.Wizard = Wizard;
    
    function Wizard(myname)
    {
        this._hitPoints = 10;
        this._mana = 0;
        this._wizardName = myname;
        this.Monster = null;
    }
    
    function getSpellName()
    {
        return ["None", "Gather", "Damage", "Shield", "Summon", "Heal",
            "Enhance", "Reflect", "Hex", "Counter"][this.currentCommand];
    }
    function getWizardName()
    {
        return this._wizardName;
    }
    
    function isHexed()
    {
        return this.empoweredHex > 0 ? true : false;
    }
    
    function isShielded()
    {
        return this.empoweredShield > 0 ? true : false;
    }
    
    function getHitPoints()
    {
        return this._hitPoints;
    }
    
    function gainHP(val)
    {
        this._hitPoints =
            this._hitPoints + val > 20 ?
            20 :
            this._hitPoints + val;
    }
    
    function loseHP(val)
    {
        this._hitPoints =
        this._hitPoints - val < 0 ?
        0 :
        this._hitPoints - val;
    }
    
    function getMana()
    {
        return this._mana;
    }
    
    function gainMana(val)
    {
        this._mana =
        this._mana + val > 5 ?
        5 :
        this._mana + val;
    }
    
    function loseMana(val)
    {
        this._mana =
        this._mana - val < 0 ?
        0 :
        this._mana - val;
    }
}

function GameEngine()
{
    var _wizOne;
    var _wizTwo;
    var _turn;
    this.GameEngine = GameEngine;
    this.next = next;
    // Events
    this.evtGameStart = null;
    this.evtRoundStart = null;
    this.evtRoundEnd = null;
    this.evtGatherMana = null;
    this.evtCastReflect = null;
    this.evtCastCounter = null;
    this.evtCastShield = null;
    this.evtCastHeal = null;
    this.evtSummonMonster = null;
    this.evtCheckDamage = null;
    this.evtTryDamage = null;
    this.evtDamageMonster = null;
    this.evtDamageWizard = null;
    this.evtDamageFail = null;
    this.evtTryCombat = null;
    this.evtCastHex = null;
    this.evtEnhance = null;
    this.evtWeakenMonster = null;
    
    function GameEngine(wizOne, wizTwo)
    {
        this._wizOne = wizOne;
        this._wizTwo = wizTwo;
        this._turn = 0;
        if (this.evtGameStart)
        {
            this.evtGameStart(this._wizOne, this._wizTwo);
        }
    }
    
    function next(spell1, spell2)
    {
        this._turn++;
        if(this.evtRoundStart)
        {
            this.evtRoundStart(this._turn);
        }
        this._wizOne.currentCommand = spell1;
        this._wizTwo.currentCommand = spell2;
        tryGather(this, this._wizOne);
        tryGather(this, this._wizTwo);
        tryReflect(this, this._wizOne);
        tryReflect(this, this._wizTwo);
        tryCounter(this, this._wizOne);
        tryCounter(this, this._wizTwo);
        tryShield(this, this._wizOne, this._wizTwo);
        tryShield(this, this._wizTwo, this._wizOne);
        tryHeal(this, this._wizOne, this._wizTwo);
        tryHeal(this, this._wizTwo, this._wizOne);
        trySummon(this, this._wizOne, this._wizTwo);
        trySummon(this, this._wizTwo, this._wizOne);
        checkDamage(this,
            tryDamage(this, this._wizOne, this._wizTwo), this._wizOne, this._wizTwo);
        checkDamage(this,
            tryDamage(this, this._wizTwo, this._wizOne), this._wizTwo, this._wizOne);
        tryCombat(this, this._wizOne, this._wizTwo);
        clearFlags(this._wizOne);
        clearFlags(this._wizTwo);
        tryHex(this, this._wizOne, this._wizTwo);
        tryHex(this, this._wizTwo, this._wizOne);
        clearOtherFlags(this._wizOne);
        clearOtherFlags(this._wizTwo);
        tryEnhance(this, this._wizOne, this._wizTwo);
        tryEnhance(this, this._wizTwo, this._wizOne);
        if(this.evtRoundEnd)
        {
            return this.evtRoundEnd(this._wizOne, this._wizTwo, this._turn);
        }
        else
        {
            return null;
        }
    }
    
    function tryGather(self, user)
    {
        if(user.currentCommand == Spell.GATHER)
        {
            user.gainMana(1);
            if (self.evtGatherMana)
            {
                self.evtGatherMana(user);
            }
        }
    }
    
    function tryReflect(self, user)
    {
        if (user.currentCommand == Spell.REFLECT)
        {
            if(user.getMana() > 1)
            {
                user.loseMana(2);
                user.reflectFlag = true;
                if(self.evtCastReflect)
                {
                    self.evtCastReflect(user, true);
                }
            }
            else
            {
                if (self.evtCastReflect)
                {
                    self.evtCastReflect(user, false);
                }
            }
        }
    }
    
    function tryCounter(self, user)
    {
        if (user.currentCommand == Spell.COUNTER)
        {
            if (user.getMana() > 0)
            {
                user.loseMana(1);
                user.counterFlag = true;
                if (self.evtCastCounter)
                {
                    self.evtCastCounter(user, true);
                }
            }
            else
            {
                if (self.evtCastCounter)
                {
                    self.evtCastCounter(user, false);
                }
            }
        }
    }
    
    function tryShield(self, attacker, defender)
    {
        if(attacker.currentCommand == Spell.SHIELD)
        {
            if(attacker.isHexed())
            {
                if (self.evtCastShield)
                {
                    self.evtCastShield(attacker, defender);
                }
            }
            else if (defender.reflectFlag)
            {
                if (attacker.empowered)
                {
                    defender.empoweredShield = 2;
                    if (self.evtCastShield)
                    {
                        self.evtCastShield(attacker, defender);
                    }
                }
                else if (defender.isShielded())
                {
                    if (self.evtCastShield)
                    {
                        self.evtCastShield(attacker, defender);
                    }
                }
                else
                {
                    defender.empoweredShield = 1;
                    if (self.evtCastShield)
                    {
                        self.evtCastShield(attacker, defender);
                    }
                }
            }
            else if (defender.counterFlag)
            {
                if (self.evtCastShield)
                {
                    self.evtCastShield(attacker, defender);
                }
            }
            else if (attacker.empowered)
            {
                attacker.empoweredShield = 2;
                if (self.evtCastShield)
                {
                    self.evtCastShield(attacker, defender);
                }
            }
            else
            {
                attacker.empoweredShield = 1;
                if (self.evtCastShield)
                {
                    self.evtCastShield(attacker, defender);
                }
            }
        }
    }
    
    function tryHeal(self, attacker, defender)
    {
        if (attacker.currentCommand == Spell.HEAL)
        {
            if (defender.counterFlag)
            {
                if (self.evtCastHeal)
                {
                    self.evtCastHeal(attacker, defender);
                }
            }
            else if (defender.reflectFlag)
            {
                if (attacker.empowered)
                {
                    if (defender.isHexed())
                    {
                        defender.gainHP(2);
                        if (self.evtCastHeal)
                        {
                            self.evtCastHeal(attacker, defender);
                        }
                    }
                    else
                    {
                        defender.empoweredShield = 1;
                        defender.gainHP(2);
                        if (self.evtCastHeal)
                        {
                            self.evtCastHeal(attacker, defender);
                        }
                    }
                }
                else
                {
                    defender.gainHP(1);
                    if (self.evtCastHeal)
                    {
                        self.evtCastHeal(attacker, defender);
                    }
                }
            }
            else
            {
                if (attacker.empowered)
                {
                    if (attacker.isHexed())
                    {
                        attacker.gainHP(2);
                        if (self.evtCastHeal)
                        {
                            self.evtCastHeal(attacker, defender);
                        }
                    }
                    else
                    {
                        attacker.empoweredShield = 1;
                        attacker.gainHP(2);
                        if (self.evtCastHeal)
                        {
                            self.evtCastHeal(attacker, defender);
                        }
                    }
                }
                else
                {
                    attacker.gainHP(1);
                    if (self.evtCastHeal)
                    {
                        self.evtCastHeal(attacker, defender);
                    }
                }
            }
        }
    }
    
    function trySummon(self, attacker, defender)
    {
        monsterLevel = 0;
        if (attacker.currentCommand == Spell.SUMMON && attacker.getMana() > 0)
        {
            if (attacker.getMana() < 3)
            {
                monsterLevel = 1;
                attacker.loseMana(1);
            }
            else
            {
                monsterLevel = 2;
                attacker.loseMana(3);
            }
            if (defender.counterFlag)
            {
                if (self.evtSummonMonster)
                {
                    self.evtSummonMonster(attacker, defender);
                }
            }
            else if (defender.reflectFlag)
            {
                if (attacker.empowered)
                {
                    if (monsterLevel < 2)
                    {
                        monsterLevel = 2;
                        defender.Monster = new Monster();
                        defender.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                    else
                    {
                        monsterLevel = 4;
                        defender.Monster = new Monster();
                        defender.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                }
                else
                {
                    if (monsterLevel < 2)
                    {
                        monsterLevel = 1;
                        defender.Monster = new Monster();
                        defender.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                    else
                    {
                        monsterLevel = 2;
                        defender.Monster = new Monster();
                        defender.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                }
            }
            else
            {
                if (attacker.empowered)
                {
                    if (monsterLevel < 2)
                    {
                        monsterLevel = 2;
                        attacker.Monster = new Monster();
                        attacker.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                    else
                    {

                        monsterLevel = 4;
                        attacker.Monster = new Monster();
                        attacker.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                }
                else
                {
                    if (monsterLevel < 2)
                    {
                        monsterLevel = 1;
                        attacker.Monster = new Monster();
                        attacker.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                    else
                    {
                        monsterLevel = 2;
                        attacker.Monster = new Monster();
                        attacker.Monster.Monster(monsterLevel);
                        if (self.evtSummonMonster) {
                            self.evtSummonMonster(attacker, defender);
                        }
                    }
                }
            }
        }
        else if (attacker.currentCommand == Spell.SUMMON &&
            attacker.getMana() < 1)
        {
            if (self.evtSummonMonster)
            {
                self.evtSummonMonster(attacker, defender);
            }
        }
    }
    
    function clearFlags(user)
    {
        user.empoweredShield =
            user.empoweredShield > 0 ?
            user.empoweredShield - 1 :
            0;
        user.empoweredHex =
            user.empoweredHex > 0 ?
            user.empoweredHex - 1 :
            0;
    }
    
    function clearOtherFlags(user)
    {
        user.empowered = false;
        user.counterFlag = false;
        user.reflectFlag = false;
    }
    
    function checkDamage(self, damage, attacker, defender)
    {
        var leftoverDamage = 0;
        if (damage < 0)
        {
            checkDamage(self, Math.abs(damage), defender, attacker);
            return;
        }
        else if (damage == 0)
        {
            return;
        }
        else
        {
            if(defender.Monster != null)
            {
                leftoverDamage = damage - defender.Monster.getHitPoints();
                defender.Monster.loseHP(damage);
                if (defender.Monster.getHitPoints() == 0)
                {
                    if (self.evtDamageMonster) {
                        self.evtDamageMonster(attacker, defender, Spell.DAMAGE, true);
                    }
                    defender.Monster = null;
                }
                else {
                    if (self.evtDamageMonster) {
                        self.evtDamageMonster(attacker, defender, Spell.DAMAGE, false);
                    }
                }
            }
            else
            {
                leftoverDamage = damage;
            }
            if (leftoverDamage > 0 && defender.isShielded())
            {
                if (self.evtDamageWizard)
                {
                    self.evtDamageWizard(attacker, defender, Spell.DAMAGE);
                }
            }
            if (leftoverDamage > 0 && !defender.isShielded())
            {
                defender.loseHP(leftoverDamage);
                if (self.evtDamageWizard)
                {
                    self.evtDamageWizard(attacker, defender, Spell.DAMAGE);
                }
            }
        }
    }
    
    function tryDamage(self, attacker, defender)
    {
        var potentialDamage = 0;
        
        if (attacker.currentCommand == Spell.DAMAGE)
        {
            if(attacker.getMana() == 0)
            {
                if (self.evtDamageFail) {
                    self.evtDamageFail(attacker, defender, Spell.NONE);
                }
                return;
            }
            else if (attacker.getMana() == 1)
            {
                potentialDamage = 2;
                attacker.loseMana(1);
            }
            else if (attacker.getMana() == 2)
            {
                potentialDamage = 3;
                attacker.loseMana(2);
            }
            else
            {
                potentialDamage = 4;
                attacker.loseMana(3);
            }
            if (attacker.empowered)
            {
                potentialDamage *= 2;
            }
            if (defender.counterFlag)
            {
                if (self.evtDamageFail) {
                    self.evtDamageFail(attacker, defender, Spell.COUNTER);
                }
                potentialDamage = 0;
            }
            else if (defender.reflectFlag)
            {
                if (self.evtDamageFail) {
                    self.evtDamageFail(attacker, defender, Spell.REFLECT);
                }
                potentialDamage *= -1;
            }
            else if (!defender.Monster && defender.isShielded())
            {
                if (self.evtDamageWizard)
                {
                    self.evtDamageWizard(attacker, defender, Spell.DAMAGE);
                }
                potentialDamage = 0;
            }
        }
	return potentialDamage;
    }
    
    function tryCombat(self, wizone, wiztwo)
    {
        if (wizone.Monster)
        {
            if (wizone.Monster.getLevel() == 4)
            {
                if (self.evtWeakenMonster)
                {
                    self.evtWeakenMonster(wizone, false);
                }
                wizone.Monster.loseHP(1);
                if (wizone.Monster.getHitPoints() == 0)
                {
                    if (self.evtWeakenMonster) {
                        self.evtWeakenMonster(wizone, true);
                    }
                    wizone.Monster = null;
                }
            }
        }
        if (wiztwo.Monster)
        {
            if (wiztwo.Monster.getLevel() == 4)
            {
                if (self.evtWeakenMonster) {
                    self.evtWeakenMonster(wiztwo, false);
                }
                wiztwo.Monster.loseHP(1);
                if (wiztwo.Monster.getHitPoints() == 0)
                {
                    if (self.evtWeakenMonster) {
                        self.evtWeakenMonster(wiztwo, true);
                    }
                    wiztwo.Monster = null;
                }
            }
        }
        var mon1name = wizone.Monster == null ? null :
            wizone.Monster.getMonsterName();
        var mon2name = wiztwo.Monster == null ? null :
            wiztwo.Monster.getMonsterName();

        if (wizone.Monster != null && wiztwo.Monster != null) {
            wizone.Monster.loseHP(wiztwo.Monster.getLevel());
            wiztwo.Monster.loseHP(wizone.Monster.getLevel());
            if (self.evtTryCombat) {
                self.evtTryCombat(wizone, wiztwo);
            }
            if (wizone.Monster.getHitPoints() == 0) {
                if (self.evtDamageMonster) {
                    self.evtDamageMonster(wizone, wiztwo, Spell.NONE, true);
                }
                wizone.Monster = null;
            }
            else {
                if (self.evtDamageMonster) {
                    self.evtDamageMonster(wizone, wiztwo, Spell.NONE, false);
                }
            }
            if (wiztwo.Monster.getHitPoints() == 0) {
                if (self.evtDamageMonster) {
                    self.evtDamageMonster(wiztwo, wizone, Spell.NONE, true);
                }
                wiztwo.Monster = null;
            }
            else {
                if (self.evtDamageMonster) {
                        self.evtDamageMonster(wiztwo, wizone, Spell.NONE, false);
                }
            }
        }
        else if (wizone.Monster != null && wiztwo.Monster == null) {
            if (self.evtDamageWizard) {
                self.evtDamageWizard(wizone, wiztwo, Spell.NONE);
            }
            if (!wiztwo.isShielded()) {
                wiztwo.loseHP(wizone.Monster.getLevel());
            }
        }
        else if (wizone.Monster == null && wiztwo.Monster != null) {
            if (self.evtDamageWizard) {
                self.evtDamageWizard(wiztwo, wizone, Spell.NONE);
            }
            if (!wizone.isShielded()) {
                wizone.loseHP(wiztwo.Monster.getLevel());
            }
        }
    }
    function tryHex(self, attacker, defender)
    {
        if (attacker.currentCommand == Spell.HEX)
        {
            if (defender.counterFlag)
            {
                if (self.evtCastHex)
                {
                    self.evtCastHex(attacker, defender);
                }
            }
            else if (defender.reflectFlag)
            {
                if (attacker.empowered)
                {
                    attacker.empoweredHex = 2;
                    if (self.evtCastHex)
                    {
                        self.evtCastHex(attacker, defender);
                    }
                }
                else
                {
                    attacker.empoweredHex = 1;
                    if (self.evtCastHex)
                    {
                        self.evtCastHex(attacker, defender);
                    }
                }
            }
            else
            {
                if (attacker.empowered)
                {
                    defender.empoweredHex = 2;
                    if (self.evtCastHex)
                    {
                        self.evtCastHex(attacker, defender);
                    }
                }
                else
                {
                    defender.empoweredHex = 1;
                    if (self.evtCastHex)
                    {
                        self.evtCastHex(attacker, defender);
                    }
                }
            }
        }
    }
    
    function tryEnhance(self, attacker, defender)
    {
        if (attacker.currentCommand == Spell.ENHANCE)
        {
            attacker.empowered = true;
            if (self.evtEnhance)
            {
                self.evtEnhance(attacker, defender);
            }
        }
    }
}
