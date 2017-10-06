/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import net from 'net';
// import { StringDecoder } from 'string_decoder';
import StreamSplitter from 'stream-splitter';
import { EventEmitter } from 'events';
// import merge from 'merge';

import { logging } from '@musicbot/core';

import buildCmd from './buildCmd';
import parseCmd from './parseCmd';

const { Logger } = logging;

const fixError = ({ id: idString, ...args }) => {
  if (idString === null || idString === undefined) {
    return null;
  }

  const id = parseInt(idString, 10);
  if (id === 0) {
    return null;
  }

  return {
    id,
    ...args,
  };
};

export default class TS3ClientQuery extends EventEmitter {
  constructor(host, port) {
    super();

    this.resetKeepalive = this.resetKeepalive.bind(this);
    this.sendKeepalive = this.sendKeepalive.bind(this);
    this.stopKeepalive = this.stopKeepalive.bind(this);
    this.banadd = this.banadd.bind(this);
    this.banclient = this.banclient.bind(this);
    this.bandel = this.bandel.bind(this);
    this.bandelall = this.bandelall.bind(this);
    this.banlist = this.banlist.bind(this);
    this.channeladdperm = this.channeladdperm.bind(this);
    this.channelclientaddperm = this.channelclientaddperm.bind(this);
    this.channelclientdelperm = this.channelclientdelperm.bind(this);
    this.channelclientlist = this.channelclientlist.bind(this);
    this.channelclientpermlist = this.channelclientpermlist.bind(this);
    this.channelconnectinfo = this.channelconnectinfo.bind(this);
    this.channelcreate = this.channelcreate.bind(this);
    this.channeldelete = this.channeldelete.bind(this);
    this.channeldelperm = this.channeldelperm.bind(this);
    this.channeledit = this.channeledit.bind(this);
    this.channelgroupadd = this.channelgroupadd.bind(this);
    this.channelgroupaddperm = this.channelgroupaddperm.bind(this);
    this.channelgroupclientlist = this.channelgroupclientlist.bind(this);
    this.channelgroupdel = this.channelgroupdel.bind(this);
    this.channelgroupdelperm = this.channelgroupdelperm.bind(this);
    this.channelgrouplist = this.channelgrouplist.bind(this);
    this.channelgrouppermlist = this.channelgrouppermlist.bind(this);
    this.channellist = this.channellist.bind(this);
    this.channelmove = this.channelmove.bind(this);
    this.channelpermlist = this.channelpermlist.bind(this);
    this.channelvariable = this.channelvariable.bind(this);
    this.clientaddperm = this.clientaddperm.bind(this);
    this.clientdbdelete = this.clientdbdelete.bind(this);
    this.clientdbedit = this.clientdbedit.bind(this);
    this.clientdblist = this.clientdblist.bind(this);
    this.clientdelperm = this.clientdelperm.bind(this);
    this.clientgetdbidfromuid = this.clientgetdbidfromuid.bind(this);
    this.clientgetids = this.clientgetids.bind(this);
    this.clientgetnamefromdbid = this.clientgetnamefromdbid.bind(this);
    this.clientgetnamefromuid = this.clientgetnamefromuid.bind(this);
    this.clientgetuidfromclid = this.clientgetuidfromclid.bind(this);
    this.clientkick = this.clientkick.bind(this);
    this.clientlist = this.clientlist.bind(this);
    this.clientmove = this.clientmove.bind(this);
    this.clientmute = this.clientmute.bind(this);
    this.clientnotifyregister = this.clientnotifyregister.bind(this);
    this.clientnotifyunregister = this.clientnotifyunregister.bind(this);
    this.clientpermlist = this.clientpermlist.bind(this);
    this.clientpoke = this.clientpoke.bind(this);
    this.clientunmute = this.clientunmute.bind(this);
    this.clientupdate = this.clientupdate.bind(this);
    this.clientvariable = this.clientvariable.bind(this);
    this.close = this.close.bind(this);
    this.complainadd = this.complainadd.bind(this);
    this.complaindel = this.complaindel.bind(this);
    this.complaindelall = this.complaindelall.bind(this);
    this.complainlist = this.complainlist.bind(this);
    this.connect = this.connect.bind(this);
    this.currentschandlerid = this.currentschandlerid.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.exam = this.exam.bind(this);
    this.ftcreatedir = this.ftcreatedir.bind(this);
    this.ftdeletefile = this.ftdeletefile.bind(this);
    this.ftgetfileinfo = this.ftgetfileinfo.bind(this);
    this.ftgetfilelist = this.ftgetfilelist.bind(this);
    this.ftinitdownload = this.ftinitdownload.bind(this);
    this.ftinitupload = this.ftinitupload.bind(this);
    this.ftlist = this.ftlist.bind(this);
    this.ftrenamefile = this.ftrenamefile.bind(this);
    this.ftstop = this.ftstop.bind(this);
    this.hashpassword = this.hashpassword.bind(this);
    this.help = this.help.bind(this);
    this.messageadd = this.messageadd.bind(this);
    this.messagedel = this.messagedel.bind(this);
    this.messageget = this.messageget.bind(this);
    this.messagelist = this.messagelist.bind(this);
    this.messageupdateflag = this.messageupdateflag.bind(this);
    this.permoverview = this.permoverview.bind(this);
    this.quit = this.quit.bind(this);
    this.send = this.send.bind(this);
    this.sendtextmessage = this.sendtextmessage.bind(this);
    this.serverconnectinfo = this.serverconnectinfo.bind(this);
    this.serverconnectionhandlerlist = this.serverconnectionhandlerlist.bind(this);
    this.servergroupadd = this.servergroupadd.bind(this);
    this.servergroupaddclient = this.servergroupaddclient.bind(this);
    this.servergroupaddperm = this.servergroupaddperm.bind(this);
    this.servergroupclientlist = this.servergroupclientlist.bind(this);
    this.servergroupdel = this.servergroupdel.bind(this);
    this.servergroupdelclient = this.servergroupdelclient.bind(this);
    this.servergroupdelperm = this.servergroupdelperm.bind(this);
    this.servergrouplist = this.servergrouplist.bind(this);
    this.servergrouppermlist = this.servergrouppermlist.bind(this);
    this.servergroupsbyclientid = this.servergroupsbyclientid.bind(this);
    this.servervariable = this.servervariable.bind(this);
    this.setclientchannelgroup = this.setclientchannelgroup.bind(this);
    this.tokenadd = this.tokenadd.bind(this);
    this.tokendelete = this.tokendelete.bind(this);
    this.tokenlist = this.tokenlist.bind(this);
    this.tokenuse = this.tokenuse.bind(this);
    this.use = this.use.bind(this);
    this.verifychannelpassword = this.verifychannelpassword.bind(this);
    this.verifyserverpassword = this.verifyserverpassword.bind(this);
    this.whoami = this.whoami.bind(this);

    this.log = new Logger('TS3ClientQuery');
    this.id = null;
    this.host = host;
    this.port = port;
  }

  connect(cb) {
    this.tcpClient = new net.Socket();

    this.tcpClient.on('close', () => {
      this.stopKeepalive();
      return this.emit('close');
    });
    this.tcpClient.on('error', (err) => {
      this.log.warn('Connection error', err);
      this.stopKeepalive();
      this.tcpClient = null;
      return this.emit('error', err);
    });

    this.emit('connecting');
    this.tcpClient.connect(this.port, this.host, () => {
      this.emit('open');
      return this.once('message.selected', (/* selectedArgs */) => {
        // send keepalives to avoid connection timeout
        this.resetKeepalive();

        return (typeof cb === 'function' ? cb() : undefined);
      });
    });

    const splitterStream = StreamSplitter('\n\r');
    splitterStream.encoding = 'utf8';

    this.tcpTokenizer = this.tcpClient.pipe(splitterStream);

    return this.tcpTokenizer.on('token', (_token) => {
      const token = _token.trim();

      if (token.startsWith('TS3 Client' || token.startsWith('Welcome'))) {
        return; // this is just helper text for normal users
      }

      const response = parseCmd(token);

      this.log.silly('Recv:', token);

      if (response.name) {
        this.emit(`message.${response.name}`, response.args);
      }

      this.emit('vars', response.args);
    });
  }

  sendKeepalive(cb) {
    this.log.silly('Send: <keep-alive>');

    return this.tcpClient.write('\n\r', 'utf8', () => (typeof cb === 'function' ? cb() : undefined));
  }

  stopKeepalive() {
    if (this.keepaliveInt != null) {
      clearInterval(this.keepaliveInt);
      this.keepaliveInt = null;
      this.log.silly('Stopped keep-alive.');
      return;
    }

    this.log.silly("Requested to stop keep-alive sending but it's already stopped!");
  }

  resetKeepalive() {
    this.stopKeepalive();

    this.log.silly('Setting up keep-alive.');
    this.keepaliveInt = setInterval(this.sendKeepalive, 60000);
  }

  close(cb) {
    this.stopKeepalive();
    if (!this.tcpClient) {
      if (typeof cb === 'function') {
        cb();
      }
      return;
    }
    this.tcpClient.destroy();
    if (typeof cb === 'function') cb();
  }

  send(cmd, _namedArgs, _positionalArgs) {
    if (!cmd) {
      throw new Error('Need command name');
    }

    let namedArgs = _namedArgs;
    let positionalArgs = _positionalArgs;

    if (Array.isArray(namedArgs)) {
      positionalArgs = namedArgs;
      namedArgs = {};
    }

    const text = buildCmd(cmd, namedArgs, positionalArgs);

    this.log.silly('Send:', text.trim());

    this.resetKeepalive();

    return new Promise((resolve) => {
      this.tcpClient.write(text, 'utf8', resolve);
    });
  }

  sendAndWaitForReply(name, reqArgs, expectedReplyName = 'vars') {
    const client = this;
    return new Promise((resolve, reject) => {
      const retval = { };
      client.once(expectedReplyName, (args) => { Object.assign(retval, args); });
      client.once('message.error', (args) => {
        const err = fixError(args);
        if (err.id !== 0) {
          reject(args);
          return;
        }
        resolve(retval);
      });
      client.send(name, reqArgs);
    });
  }

  // TODO - banadd

  // TODO - banclient

  // TODO - bandel

  // TODO - bandelall

  // TODO - banlist

  // TODO - channeladdperm

  // TODO - channelclientaddperm

  // TODO - channelclientdelperm

  // TODO - channelclientlist

  // TODO - channelclientpermlist

  /**
   * Get channel connection information for specified channelid from the currently
   * selected server connection handler. If no channelid is provided, information
   * for the current channel will be received.
   */
  channelconnectinfo(cid = null) {
    return this.send(
      'channelconnectinfo',
      { cid },
    );
  }

  /**
   * Creates a new channel using the given properties and displays its ID.
   *
   * N.B. The channel_password property needs a hashed password as a value.
   * The hash is a sha1 hash of the password, encoded in base64. You can
   * use the "hashpassword" command to get the correct value.
   */
  channelcreate(channelName, channelProperties = {}) {
    return this.sendAndWaitForReply('channelcreate', {
      ...channelProperties,
      channelName,
    });
  }

  // TODO - channeldelete

  // TODO - channeldelperm

  /**
   * Changes a channels configuration using given properties.
   */
  channeledit(cid, channelProperties) {
    this.sendAndWaitForReply('channeledit', {
      ...channelProperties,
      cid,
    });
  }

  // TODO - channelgroupadd

  // TODO - channelgroupaddperm

  // TODO - channelgroupclientlist

  // TODO - channelgroupdel

  // TODO - channelgroupdelperm

  // TODO - channelgrouplist

  // TODO - channelgrouppermlist

  // TODO - channellist

  // TODO - channelmove

  // TODO - channelpermlist

  // TODO - channelvariable

  // TODO - clientaddperm

  // TODO - clientdbdelete

  // TODO - clientdbedit

  // TODO - clientdblist

  // TODO - clientdelperm

  /**
   * Displays the database ID matching the unique identifier specified by cluid.
   */
  clientgetdbidfromuid(cluid) {
    return this.sendAndWaitForReply(
      'clientgetdbidfromuid',
      { cluid },
    );
  }

  /**
   * Displays all client IDs matching the unique identifier specified by cluid.
   */
  clientgetids(cluid) {
    return this.sendAndWaitForReply(
      'clientgetids',
      { cluid },
    );
  }

  /**
   * Displays the unique identifier and nickname matching the database ID specified
   * by cldbid.
   */
  clientgetnamefromdbid(cldbid) {
    return this.sendAndWaitForReply(
      'clientgetnamefromdbid',
      { cldbid },
    );
  }

  /**
   * Displays the database ID and nickname matching the unique identifier specified
   * by cluid.
   */
  clientgetnamefromuid(cluid) {
    return this.sendAndWaitForReply(
      'clientgetnamefromuid',
      { cluid },
    );
  }

  /**
   * Displays the unique identifier and nickname associated with the client
   * specified by the clid parameter.
   */
  clientgetuidfromclid(clid) {
    return this.sendAndWaitForReply(
      'clientgetuidfromclid',
      { clid },
      'notifyclientuidfromclid',
    );
  }

  /**
   * Kicks one or more clients specified with clid from their currently joined
   * channel or from the server, depending on reasonid. The reasonmsg parameter
   * specifies a text message sent to the kicked clients. This parameter is optional
   * and may only have a maximum of 40 characters.
   *
   * Available reasonid values are:
   * 4: Kick the client from his current channel into the default channel
   * 5: Kick the client from the server
   */
  clientkick(reasonid, _reasonmsg, _clid) {
    let reasonmsg = _reasonmsg;
    let clid = _clid;

    if (!clid) {
      clid = reasonmsg;
      reasonmsg = null;
    }

    return this.sendAndWaitForReply('clientkick', {
      reasonid,
      reasonmsg,
      clid,
    });
  }

  /**
   * Displays a list of clients that are known. Included information is the
   * clientID, nickname, client database id, channelID and client type.
   * Please take note that the output will only contain clients which are in
   * channels you are currently subscribed to. Using the optional modifier
   * parameters you can enable additional information per client.
   *
   * Here is a list of the additional display paramters you will receive for
   * each of the possible modifier parameters.
   *
   * -uid:
   * client_unique_identifier
   *
   * -away:
   * client_away
   * client_away_message
   *
   * -voice:
   * client_flag_talking
   * client_input_muted
   * client_output_muted
   * client_input_hardware
   * client_output_hardware
   * client_talk_power
   * client_is_talker
   * client_is_priority_speaker
   * client_is_recording
   * client_is_channel_commander
   * client_is_muted
   *
   * -groups:
   * client_servergroups
   * client_channel_group_id
   *
   * -icon:
   * client_icon_id
   *
   * -country:
   * client_country
   */
  clientlist(modifiers) {
    const cleanedModifiers = [];
    for (let index = 0; index < modifiers.length; index += 1) {
      const v = modifiers[index];
      if (!v.startsWith('-')) {
        cleanedModifiers.push(`-${v}`);
      } else {
        cleanedModifiers.push(v);
      }
    }

    return this.sendAndWaitForReply('clientlist', cleanedModifiers);
  }

  // TODO - clientmove

  // TODO - clientmute

  /**
   * This command allows you to listen to events that the client encounters. Events
   * are things like people starting or stopping to talk, people joining or leaving,
   * new channels being created and many more.
   * It registers for client notifications for the specified
   * serverConnectionHandlerID. If the serverConnectionHandlerID is set to zero it
   * applies to all server connection handlers. Possible event values are listed
   * below, additionally the special string "any" can be used to subscribe to all
   * events.
   *
   * Possible values for event:
   *   notifytalkstatuschange
   *   notifymessage
   *   notifymessagelist
   *   notifycomplainlist
   *   notifybanlist
   *   notifyclientmoved
   *   notifyclientleftview
   *   notifycliententerview
   *   notifyclientpoke
   *   notifyclientchatclosed
   *   notifyclientchatcomposing
   *   notifyclientupdated
   *   notifyclientids
   *   notifyclientdbidfromuid
   *   notifyclientnamefromuid
   *   notifyclientnamefromdbid
   *   notifyclientuidfromclid
   *   notifyconnectioninfo
   *   notifychannelcreated
   *   notifychanneledited
   *   notifychanneldeleted
   *   notifychannelmoved
   *   notifyserveredited
   *   notifyserverupdated
   *   channellist
   *   channellistfinished
   *   notifytextmessage
   *   notifycurrentserverconnectionchanged
   *   notifyconnectstatuschange
   */
  clientnotifyregister(schandlerid, event) {
    return this.sendAndWaitForReply('clientnotifyregister', {
      schandlerid,
      event,
    });
  }

  /**
   * Unregisters from all previously registered client notifications.
   */
  clientnotifyunregister() {
    return this.sendAndWaitForReply('clientnotifyunregister');
  }

  /**
   * Displays a list of permissions defined for a client.
   */
  clientpermlist(cldbid) {
    return this.sendAndWaitForReply(
      'clientpermlist',
      { cldbid },
    );
  }

  /**
   * Sends a poke message to the client specified with clid.
   */
  clientpoke(clid, msg) {
    return this.sendAndWaitForReply('clientpoke', {
      msg,
      clid,
    });
  }

  // TODO - clientunmute

  /**
   * Sets one or more values concerning your own client, and makes them available
   * to other clients through the server where applicable. Available idents are:
   *
   * client_nickname:             set a new nickname
   * client_away:                 0 or 1, set us away or back available
   * client_away_message:         what away message to display when away
   * client_input_muted:          0 or 1, mutes or unmutes microphone
   * client_output_muted:         0 or 1, mutes or unmutes speakers/headphones
   * client_input_deactivated:    0 or 1, same as input_muted, but invisible to
   *                              other clients
   * client_is_channel_commander: 0 or 1, sets or removes channel commander
   * client_nickname_phonetic:    set your phonetic nickname
   * client_flag_avatar:          set your avatar
   * client_meta_data:            any string that is passed to all clients that
   *                              have vision of you.
   * client_default_token:        privilege key to be used for the next server
   *                              connect
   */
  clientupdate(idents) {
    return this.sendAndWaitForReply('clientupdate', idents);
  }

  /**
   * Retrieves client variables from the client (no network usage). For each client
   * you can specify one or more properties that should be queried, and this whole
   * block of clientID and properties can be repeated to get information about
   * multiple clients with one call of clientvariable.
   *
   * Available properties are:
   * client_unique_identifier
   * client_nickname
   * client_input_muted
   * client_output_muted
   * client_outputonly_muted
   * client_input_hardware
   * client_output_hardware
   * client_meta_data
   * client_is_recording
   * client_database_id
   * client_channel_group_id
   * client_servergroups
   * client_away
   * client_away_message
   * client_type
   * client_flag_avatar
   * client_talk_power
   * client_talk_request
   * client_talk_request_msg
   * client_description
   * client_is_talker
   * client_is_priority_speaker
   * client_unread_messages
   * client_nickname_phonetic
   * client_needed_serverquery_view_power
   * client_icon_id
   * client_is_channel_commander
   * client_country
   * client_channel_group_inherited_channel_id
   * client_flag_talking
   * client_is_muted
   * client_volume_modificator
   *
   * These properties are always available for yourself, but need to be requested
   * for other clients. Currently you cannot request these variables via
   * clientquery:
   * client_version
   * client_platform
   * client_login_name
   * client_created
   * client_lastconnected
   * client_totalconnections
   * client_month_bytes_uploaded
   * client_month_bytes_downloaded
   * client_total_bytes_uploaded
   * client_total_bytes_downloaded
   *
   * These properties are available only for yourself:
   * client_input_deactivated
  */
  clientvariable(clid, variables) {
    if (!clid) {
      throw new Error('Need client ID');
    }
    if (!Array.isArray(variables)) {
      throw new Error('variables needs to be an array of requested client variables.');
    }
    return this.sendAndWaitForReply('clientvariable', { clid }, variables);
  }

  // TODO - complainadd

  // TODO - complaindel

  // TODO - complaindelall

  // TODO - complainlist

  /**
   * Get server connection handler ID of current server tab.
   */
  currentschandlerid() {
    return this.sendAndWaitForReply('currentschandlerid');
  }

  disconnect() { return this.close(); }

  // TODO - exam

  // TODO - ftcreatedir

  // TODO - ftdeletefile

  // TODO - ftgetfileinfo

  // TODO - ftgetfilelist

  // TODO - ftinitdownload

  // TODO - ftinitupload

  // TODO - ftlist

  // TODO - ftrenamefile

  // TODO - ftstop

  // TODO - hashpassword

  // TODO - help

  // TODO - messageadd

  // TODO - messagedel

  // TODO - messageget

  // TODO - messagelist

  // TODO - messageupdateflag

  // TODO - permoverview

  quit() { return this.close(); }

  /**
   * Sends a text message a specified target. The type of the target is determined
   * by targetmode.
   * Available targetmodes are:
   * 1: Send private text message to a client. You must specify the target parameter
   * 2: Send message to the channel you are currently in. Target is ignored.
   * 3: Send message to the entire server. Target is ignored.
   */
  sendtextmessage(targetmode, _target, _msg) {
    let msg = _msg;
    let target = _target;
    if ((targetmode !== 1) && (!msg || (typeof msg === 'function'))) {
      msg = target;
      target = null;
    }
    return this.sendAndWaitForReply('sendtextmessage', {
      targetmode,
      target,
      msg,
    });
  }

  // TODO - serverconnectinfo

  // TODO - serverconnectionhandlerlist

  // TODO - servergroupadd

  // TODO - servergroupaddclient

  // TODO - servergroupaddperm

  // TODO - servergroupclientlist

  // TODO - servergroupdel

  // TODO - servergroupdelclient

  // TODO - servergroupdelperm

  // TODO - servergrouplist

  // TODO - servergrouppermlist

  // TODO - servergroupsbyclientid

  // TODO - servervariable

  // TODO - setclientchannelgroup

  // TODO - tokenadd

  // TODO - tokendelete

  // TODO - tokenlist

  /**
   * Use a token key gain access to a server or channel group. Please note that the
   * server will automatically delete the token after it has been used.
   */
  tokenuse(token) {
    return this.sendAndWaitForReply(
      'tokenuse',
      { token },
    );
  }

  /**
   * Selects the server connection handler scHandlerID or, if no parameter is given,
   * the currently active server connection handler is selected.
   */
  use(schandlerid) {
    return this.sendAndWaitForReply(
      'use',
      { schandlerid },
      'message.selected',
    );
  }

  // TODO - verifychannelpassword

  /**
   * Verifies the server password and will return an error if the password is
   * incorrect.
   */
  verifyserverpassword(password) {
    return this.sendAndWaitForReply(
      'verifyserverpassword',
      { password },
    );
  }

  /**
   * Retrieves information about ourself:
   * - ClientID (if connected)
   * - ChannelID of the channel we are in (if connected)
   *
   * If not connected, an error is returned.
   */
  whoami() {
    return this.sendAndWaitForReply('whoami');
  }
}
