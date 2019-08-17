function createStat() {
  return {
    actions: 0,
    opportunities: 0,
    hadOpportunity: false,
    tookAction: false,
    process: function() {
      if (this.hadOpportunity) {
        opportunities += 1;
      };
      if (this.tookAction) {
        actions += 1;
      }
      hadOpportunity = false;
      tookAction = false;
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
