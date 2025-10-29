import { ArrowLeft, Star, Crown, Sparkles, Lock, Check, Zap, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ShopScreenProps {
  onNavigate: (screen: string) => void;
}

export function ShopScreen({ onNavigate }: ShopScreenProps) {
  const userStars = 342;

  const premiumPlans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      features: [
        'Unlimited lessons',
        'All premium badges',
        'Custom avatars',
        'Ad-free experience',
        'Priority support',
        'Detailed progress reports'
      ],
      popular: false,
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      save: 'Save 33%',
      features: [
        'Unlimited lessons',
        'All premium badges',
        'Custom avatars',
        'Ad-free experience',
        'Priority support',
        'Detailed progress reports',
        'Exclusive content',
        'Family sharing (up to 4)'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Lifetime',
      price: '$199.99',
      period: 'one-time',
      save: 'Best Value',
      features: [
        'Everything in Yearly',
        'Lifetime access',
        'Future updates included',
        'Exclusive lifetime badges',
        'VIP support'
      ],
      popular: false,
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  const avatarPacks = [
    { id: 1, name: 'Space Explorer', emoji: '🚀', price: 50, owned: true },
    { id: 2, name: 'Superhero', emoji: '🦸', price: 50, owned: true },
    { id: 3, name: 'Animal Friends', emoji: '🐼', price: 50, owned: false },
    { id: 4, name: 'Princess/Prince', emoji: '👑', price: 75, owned: false },
    { id: 5, name: 'Dinosaur', emoji: '🦕', price: 50, owned: false },
    { id: 6, name: 'Underwater', emoji: '🐠', price: 50, owned: false },
  ];

  const powerUps = [
    { name: 'Extra Lives Pack', icon: '❤️', description: '5 extra lives', price: 20 },
    { name: 'Star Booster', icon: '⭐', description: '2x stars for 1 day', price: 30 },
    { name: 'Hint Helper', icon: '💡', description: '10 hints', price: 25 },
    { name: 'Time Freeze', icon: '⏰', description: 'Freeze timer 3 times', price: 35 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={() => onNavigate('home')}
              className="bg-white/20 hover:bg-white/30 rounded-xl"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-white">Shop</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>{userStars}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Tabs defaultValue="premium" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-1 shadow-md">
            <TabsTrigger value="premium" className="rounded-xl">
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="avatars" className="rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Avatars
            </TabsTrigger>
            <TabsTrigger value="powerups" className="rounded-xl">
              <Zap className="w-4 h-4 mr-2" />
              Power-ups
            </TabsTrigger>
          </TabsList>

          {/* Premium Plans */}
          <TabsContent value="premium" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-purple-700 mb-2">Unlock Premium Features</h3>
              <p className="text-purple-600">Get unlimited access to all learning content</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {premiumPlans.map((plan, idx) => (
                <Card 
                  key={idx}
                  className={`p-6 rounded-3xl shadow-lg border-0 relative overflow-hidden ${
                    plan.popular ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-bl-2xl">
                      <span>Most Popular</span>
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Crown className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-purple-700 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-purple-700">{plan.price}</span>
                    <span className="text-purple-500">{plan.period}</span>
                  </div>
                  
                  {plan.save && (
                    <Badge className="mb-4 bg-green-100 text-green-700">{plan.save}</Badge>
                  )}

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full h-12 bg-gradient-to-r ${plan.color} hover:opacity-90 rounded-xl text-white shadow-lg`}
                  >
                    Subscribe Now
                  </Button>
                </Card>
              ))}
            </div>

            {/* Teacher Plan */}
            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-green-400 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white mb-2">Teacher & Classroom Plan</h3>
                  <p className="text-white/90 mb-4">Manage up to 30 students with detailed analytics and custom lesson plans</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-white/20">Bulk pricing</Badge>
                    <Badge className="bg-white/20">Admin dashboard</Badge>
                    <Badge className="bg-white/20">Custom content</Badge>
                  </div>
                </div>
                <Button className="bg-white text-green-600 hover:bg-gray-50 rounded-xl">
                  Learn More
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Avatar Packs */}
          <TabsContent value="avatars" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-purple-700 mb-2">Avatar Packs</h3>
              <p className="text-purple-600">Customize your character with fun themes!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {avatarPacks.map((pack) => (
                <Card 
                  key={pack.id}
                  className="p-6 rounded-3xl shadow-lg border-0 bg-white text-center relative"
                >
                  {pack.owned && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className="text-6xl mb-3">{pack.emoji}</div>
                  <h4 className="text-purple-700 mb-2">{pack.name}</h4>
                  
                  {pack.owned ? (
                    <Badge className="bg-green-100 text-green-700">Owned</Badge>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-3 text-purple-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{pack.price} stars</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white"
                      >
                        Unlock
                      </Button>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Power-ups */}
          <TabsContent value="powerups" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-purple-700 mb-2">Power-ups</h3>
              <p className="text-purple-600">Boost your learning with special items!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {powerUps.map((powerup, idx) => (
                <Card 
                  key={idx}
                  className="p-6 rounded-3xl shadow-lg border-0 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                      {powerup.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-purple-700">{powerup.name}</h4>
                      <p className="text-purple-500">{powerup.description}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-purple-700">{powerup.price}</span>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white"
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 rounded-3xl shadow-lg border-0 bg-gradient-to-r from-orange-300 to-yellow-400">
              <div className="flex items-center gap-4">
                <Gift className="w-12 h-12 text-orange-700" />
                <div>
                  <h4 className="text-orange-800 mb-1">Daily Gift</h4>
                  <p className="text-orange-700">Come back tomorrow for a free power-up!</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
