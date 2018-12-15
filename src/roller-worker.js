
import Actor from './actorsystem/Actor'
import RollerActor from './actors/roller'

Actor.createInWorker('roller', RollerActor)