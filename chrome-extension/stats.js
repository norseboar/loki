function createStat(statData) {
  return {
    actions: statData ? statData.actions : 0,
    opportunities: statData ? statData.opportunities : 0,
    hadOpportunity: false,
    tookAction: false,
    process: function() {
      if (this.hadOpportunity) {
        this.opportunities += 1;
      };
      if (this.tookAction) {
        this.actions += 1;
      }
      this.hadOpportunity = false;
      this.tookAction = false;
    },
    setTookAction: function() {
      this.hadOpportunity = true;
      this.tookAction = true;
    },
    setHadOpportunity: function() {
      this.hadOpportunity = true;
    },
    getPercentage: function() {
      return Math.round(100*this.actions/this.opportunities)
    }
  }
}
