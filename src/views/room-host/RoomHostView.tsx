import { IRoomSession, RoomEngineEvent, RoomId, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomSession, SetActiveRoomId, StartRoomSession } from '../../api';
import { useRoomEngineEvent } from '../../hooks/events/nitro/room/room-engine-event';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { RoomView } from '../room/RoomView';

export const RoomHostView: FC<{}> = props =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = GetRoomSession();

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                SetActiveRoomId(event.roomId);
                setRoomSession(session);
                return;
            case RoomEngineEvent.DISPOSED:
                setRoomSession(null);
                return;
        }
    }, []);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                StartRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    return (
        <div className="nitro-room-host w-100 h-100">
            <RoomView roomSession={ roomSession } />
        </div>
    );
}
