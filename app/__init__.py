from functools import wraps
import os

from flask import abort, Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

CORS_URL = 'chrome-extension://gapdhblmlhmgahljicdehhjpeclbjhde'

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models here so that migrations work
# Import must be below app being defined to avoid circular imports
from app.models import Player  # noqa


def check_password(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        headers = request.headers
        if (headers.get('X-Api-Key', '') != app.config['API_KEY']):
            abort(401)
        return f(*args, **kwargs)
    return decorated_function


@app.after_request
def add_headers(res):
    new_accepted_headers = 'X-Api-Key, Content-Type'
    res.headers.add('Access-Control-Allow-Origin', '*')
    res.headers.add('Access-Control-Allow-Headers', new_accepted_headers)
    res.headers.add('Access-Control-Allow-Methods',
                    'HEAD,OPTIONS,GET,POST,PATCH,DELETE')
    return res

@app.route('/players/<pid>')
@check_password
def get_player(pid):
    p = Player.query.get(pid)
    if not p:
        abort(404)
    return p.to_dict()


@app.route('/players/', methods=['POST'])
@check_password
def create_player():
    print(request)
    print(request.json)
    data = request.json
    print(data)
    p = Player(
        data.get('pid'),
        data.get('nick', None),
        data.get('vpip', None),
        data.get('pfr', None),
        data.get('threeBet', None),
        data.get('foldToThreeBet', None),
        data.get('afp', None),
        data.get('cBet', None),
        data.get('foldToCbet', None)
    )
    db.session.add(p)
    db.session.commit()
    return p.to_dict()
    return


@app.route('/players/<pid>', methods=['PATCH'])
@check_password
def update_player(pid):
    p = Player.query.get(pid)
    if not p:
        abort(404)

    data = request.json
    p.update(
        data.get('nick', None),
        data.get('vpip', None),
        data.get('pfr', None),
        data.get('threeBet', None),
        data.get('foldToThreeBet', None),
        data.get('afp', None),
        data.get('cBet', None),
        data.get('foldToCbet', None)
    )
    db.session.add(p)
    db.session.commit()
    return p.to_dict()


@app.route('/players/<pid>', methods=['DELETE'])
@check_password
def delete_player(pid):
    p = Player.query.get(pid)
    if not p:
        abort(404)
    db.session.delete(p)
    db.session.commit()


@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'Player': Player
    }
