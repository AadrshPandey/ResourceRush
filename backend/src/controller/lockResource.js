import {redis} from '../cacheInit/redis.js';
import {queue} from '../cacheInit/queue.js';

const luaScript = `
    local currentTickets = tonumber(redis.call('GET', KEYS[1]) or '0')
    if( currentTickets > 0 ) then 
        redis.call('DECR', KEYS[1])
        return 1
    else 
        return 0

    end
`;

const lockResource = async (req, res) => {
    const bookStartTime = new Date(process.env.BOOK_START_TIME).getTime();
    const currentTime = Date.now();
    const arrivalTime = new Date(currentTime).toISOString().slice(0, 23).replace('T', ' ');
    const ip = req.ip;

    if (currentTime < bookStartTime) {
        return res.status(403).json({ message: "Booking is not allowed yet." });
    }

    const result = await redis.eval(luaScript, 1, 'tickets'); //for atomic decrement of tickets in redis
    const status = result === 1 ? 'booked' : 'sold out';

    await queue.add('audit_logs', {ip, status, arrivalTime});

    if(result === 1) {
        return res.status(200).json({ message: "Ticket booked successfully." });
    }
    else {
        return res.status(200).json({ message: "Tickets are sold out." });
    }
};

export { lockResource };