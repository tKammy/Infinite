// Model
function AdsrCardModel(params) {
  var obj = params.obj || null;
  if(obj) {
    var copy = $.extend(true, {}, params.obj);
    copy.name = null;
    obj.clone.push(copy);
    return copy;
  } else {
    params.type = ADSR;
    params.deckId = 'deck2';
    ProtoCardModel.call(this, params);
    Object.setPrototypeOf(AdsrCardModel.prototype, ProtoCardModel.prototype);
    this.addKnob({name: 'AttackTime', id: this.name + '_AttackTime', size: MIDDLE, value: 200, color: '#233433'});
    this.addKnob({name: 'Decay', id: this.name + '_Decay', size: MIDDLE, value: 200, color: '#233433'});
    this.addKnob({name: 'Time', id: this.name + '_Time', size: MIDDLE, value: 200, color: '#233433'});
    this.addKnob({name: 'Sustain', id: this.name + '_Sustain', size: MIDDLE, value: 200, color: '#233433'});
    this.addKnob({name: 'Release', id: this.name + '_Release', size: MIDDLE, value: 200, color: '#233433'});
  } 
}


AdsrCardModel.prototype = {
  play: function(prev) {
    this.startTime = 0;
    this.audioNode = context.createGain();
    prev.connect(this.audioNode);
    for(var i = 0; i < this.next.length; i++) {
      this.next[i].play(this.audioNode);
    }
    this.startTime = context.currentTime;
    this.audioNode.gain.setValueAtTime(0, this.startTime);
  },

  postSend: function() {
   // console.log("startTime: " + this.startTime);
    // TODO: create get currentValue method
    // attackTime: 0 - 3[s]
    var attackTime = this.startTime + parseFloat((this.ctrls['AttackTime'].value - 120) / 100);
    // decayTime: 0 - 3[s]
    var decayTime = parseFloat((this.ctrls['Time'].value - 120) / 100);
    var decayLevel = (this.ctrls['Decay'].value - 120) / 300;
    // sustainLevel
    var sustainLevel = (this.ctrls['Sustain'].value - 120) / 300;
    //attack
    this.audioNode.gain.linearRampToValueAtTime(decayLevel, attackTime);
    //decay
    this.audioNode.gain.setTargetAtTime(sustainLevel, attackTime, decayTime);
   // console.log("attackTime: " + attackTime + ", decayTime: " + decayTime + ", decayLevel: " + decayLevel + ", sustainLevel: " + sustainLevel);
  },

  stop: function() {
    var currentTime = context.currentTime;
    this.audioNode.gain.cancelScheduledValues(currentTime);
    this.audioNode.gain.setValueAtTime(this.audioNode.gain.value, currentTime);
    // releaseTime: 0 - 3[s]
    var releaseTime = (this.ctrls['Release'].value - 120) / 300;
    this.audioNode.gain.linearRampToValueAtTime(0, currentTime + releaseTime);
  }
}
