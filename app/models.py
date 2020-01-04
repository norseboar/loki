from app import db
from sqlalchemy import Column, Integer, JSON, Text


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
            self.vpip = vpip
        if pfr:
            self.pfr = pfr
        if threeBet:
            self.threeBet = threeBet
        if foldToThreeBet:
            self.foldToThreeBet = foldToThreeBet
        if afp:
            self.afp = afp
        if cBet:
            self.cBet = cBet
        if foldToCbet:
            self.foldToCbet = foldToCbet
