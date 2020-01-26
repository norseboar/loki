from app import db
from sqlalchemy import Column, Integer, JSON, Text


def update_stat(diff, stat):
    new_stat = stat.copy()
    new_stat['sessionActions'] += diff['sessionActions']
    new_stat['sessionOpportunities'] += diff['sessionOpportunities']
    return new_stat


class Player(db.Model):
    __tablename__ = 'players'
    id = Column(Integer, primary_key=True)
    nickname = Column(Text)
    vpip = Column(JSON)
    pfr = Column(JSON)
    threeBet = Column(JSON)
    foldToThreeBet = Column(JSON)
    afp = Column(JSON)
    cBet = Column(JSON)
    foldToCbet = Column(JSON)

    def __init__(self, pid, nickname, vpip, pfr, threeBet, foldToThreeBet,
                 afp, cBet, foldToCbet):
        self.id = pid
        self.nickname = nickname
        self.vpip = vpip
        self.pfr = pfr
        self.threeBet = threeBet
        self.foldToThreeBet = foldToThreeBet
        self.afp = afp
        self.cBet = cBet
        self.foldToCbet = foldToCbet

    def to_dict(self):
        return {
            'pid': self.id,
            'nick': self.nickname,
            'vpip': self.vpip,
            'pfr': self.pfr,
            'threeBet': self.threeBet,
            'foldToThreeBet': self.foldToThreeBet,
            'afp': self.afp,
            'cBet': self.cBet,
            'foldToCbet': self.foldToCbet
        }

    def update(self, nickname=None, vpip=None, pfr=None, threeBet=None,
               foldToThreeBet=None, afp=None, cBet=None, foldToCbet=None):
        if nickname:
            self.nickname = nickname
        if vpip:
            self.vpip = update_stat(vpip, self.vpip)
        if pfr:
            self.pfr = update_stat(pfr, self.pfr)
        if threeBet:
            self.threeBet = update_stat(threeBet, self.threeBet)
        if foldToThreeBet:
            self.foldToThreeBet = update_stat(
                foldToThreeBet, self.foldToThreeBet)
        if afp:
            self.afp = update_stat(afp, self.afp)
        if cBet:
            self.cBet = update_stat(cBet, self.cBet)
        if foldToCbet:
            self.foldToCbet = update_stat(foldToCbet, self.foldToCbet)
