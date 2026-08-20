import { motion } from 'framer-motion';
import useSWR from 'swr';
import PlayerCard3D from '../3d/PlayerCard3D';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function PlayersSection() {
  const { data: players, error } = useSWR('/api/players', fetcher);

  if (error) return <div className="text-center py-20">Failed to load players</div>;
  if (!players) return <div className="text-center py-20">Loading...</div>;

  const activePlayers = players.filter(p => p.isActive);

  return (
    <section id="players" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gold-text">Our</span> <span className="silver-text">Players</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Meet the talented individuals who make up our competitive roster
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activePlayers.map((player, index) => (
            <motion.div
              key={player._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <PlayerCard3D player={player} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}